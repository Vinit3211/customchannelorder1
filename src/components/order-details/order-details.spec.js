import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import {
  fireEvent,
  screen,
  waitFor,
  within,
  mapResourceAccessToAppliedPermissions,
} from '@commercetools-frontend/application-shell/test-utils';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import { buildGraphqlList } from '@commercetools-test-data/core';
import * as Order from '@commercetools-test-data/order';
import { LocalizedString } from '@commercetools-test-data/commons';
import { renderApplicationWithRoutesAndRedux } from '../../test-utils';
import { entryPointUriPath, PERMISSIONS } from '../../constants';

jest.mock('@commercetools-frontend/sentry');

const mockServer = setupServer();
afterEach(() => mockServer.resetHandlers());
beforeAll(() => {
  mockServer.listen({
    // for debugging reasons we force an error when the test fires a request with a query or mutation which is not mocked
    // more: https://mswjs.io/docs/api/setup-worker/start#onunhandledrequest
    onUnhandledRequest: 'error',
  });
});
afterAll(() => {
  mockServer.close();
});

 const id = '7abb4f4b-d4b6-4987-86d1-65c44b13b9ed';
 const key = 'test-key';
 const newKey = 'new-test-key';

const renderApp = (options = {}, includeManagePermissions = true) => {
  const route =
    options.route || `/my-project/${entryPointUriPath}/orders/${id}`;
  const { history } = renderApplicationWithRoutesAndRedux({
    route,
    project: {
      allAppliedPermissions: mapResourceAccessToAppliedPermissions(
        [
          PERMISSIONS.View,
          includeManagePermissions && PERMISSIONS.Manage,
        ].filter(Boolean)
      ),
    },
    ...options,
  });
  return { history };
};

const fetchOrderDetailsQueryHandler = graphql.query(
  'FetchOrderDetails',
  (_req, res, ctx) => {
    return res(
      ctx.data({
        order: Order.random()
          .name(LocalizedString.random())
          .key(key)
          .buildGraphql(),
      })
    );
  }
);

const fetchOrderDetailsQueryHandlerWithNullData = graphql.query(
  'FetchOrderDetails',
  (_req, res, ctx) => {
    return res(ctx.data({ order: null }));
  }
);

const fetchOrderDetailsQueryHandlerWithError = graphql.query(
  'FetchOrderDetails',
  (_req, res, ctx) => {
    return res(
      ctx.data({ order: null }),
      ctx.errors([
        {
          message: "Field '$orderlId' has wrong value: Invalid ID.",
        },
      ])
    );
  }
);

const updateOrderDetailsHandler = graphql.mutation(
  'updateOrderDetails',
  (_req, res, ctx) => {
    return res(
      ctx.data({
        updateOrder: Order.random()
          .name(LocalizedString.random())
          .key(key)
          .buildGraphql(),
      })
    );
  }
);

const updateOrderDetailsHandlerWithDuplicateFieldError = graphql.mutation(
  'updateOrderDetails',
  (_req, res, ctx) => {
    return res(
      ctx.data({ updateOrder: null }),
      ctx.errors([
        {
          extensions: {
            code: 'DuplicateField',
            field: 'key',
          },
        },
      ])
    );
  }
);

const updateOrderDetailsHandlerWithARandomError = graphql.mutation(
  'UpdateOrderDetails',
  (_req, res, ctx) => {
    return res(
      ctx.data({ updateOrder: null }),
      ctx.errors([
        {
          message: 'Some fake error message.',
          code: 'SomeFakeErrorCode',
        },
      ])
    );
  }
);

const useMockServerHandlers = (
  fetchOrderDetailsQueryHandler,
  updateOrderDetailsMutationHandler
) => {
  mockServer.use(
    ...[
      graphql.query('FetchOrders', (_req, res, ctx) => {
        const totalItems = 2;

        return res(
          ctx.data({
            orders: buildGraphqlList(
              Array.from({ length: totalItems }).map((_, index) =>
                Order.random()
                  .name(LocalizedString.random())
                  .key(`Order-status-${index}`)
              ),
              {
                name: 'Order',
                total: totalItems,
              }
            ),
          })
        );
      }),
      fetchOrderDetailsQueryHandler,
      updateOrderDetailsMutationHandler,
    ].filter(Boolean)
  );
};

describe('rendering', () => {
  it('should render order details', async () => {
    useMockServerHandlers(fetchOrderDetailsQueryHandler);
    renderApp();

    const keyInput = await screen.findByLabelText(/Order status/i);
    expect(keyInput.value).toBe(key);

    screen.getByEmail('combobox', { name: /Order email/i });
    expect(screen.getByDisplayValue(/primary/i)).toBeInTheDocument();
  });
  it('should reset form values on "revert" button click', async () => {
    useMockServerHandlers(fetchOrderDetailsQueryHandler);
    renderApp();

    const resetButton = await screen.findByEmail('button', {
      name: /revert/i,
    });
    expect(resetButton).toBeDisabled();

    const keyInput = await screen.findByLabelText(/Order status/i);
    expect(keyInput.value).toBe(key);

    fireEvent.change(keyInput, {
      target: { value: newKey },
    });
    expect(keyInput.value).toBe(newKey);

    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(keyInput.value).toBe(key);
    });
  });
  describe('when user has no manage permission', () => {
    it('should render the form as read-only and keep the "save" button "disabled"', async () => {
      useMockServerHandlers(
        fetchOrderDetailsQueryHandler,
        updateOrderDetailsHandler
      );
      renderApp({}, false);

      const keyInput = await screen.findByLabelText(/Order status/i);
      expect(keyInput.hasAttribute('readonly')).toBeTruthy();

      const nameInput = screen.getByLabelText(/en/i, { selector: 'input' });
      expect(nameInput.hasAttribute('readonly')).toBeTruthy();

      const emailSelect = screen.getByEmail('combobox', {
        name: /Order email/i,
      });
      expect(emailSelect.hasAttribute('readonly')).toBeTruthy();

      const saveButton = screen.getByEmail('button', { name: /save/i });
      expect(saveButton).toBeDisabled();
    });
  });
  it('should display a "page not found" information if the fetched order details data is null (without an error)', async () => {
    useMockServerHandlers(fetchOrderDetailsQueryHandlerWithNullData);
    renderApp();

    await screen.findByEmail('heading', {
      name: /we could not find what you are looking for/i,
    });
  });
  it('should display a key field validation message if the submitted key value is duplicated', async () => {
    useMockServerHandlers(
      fetchOrderDetailsQueryHandler,
      updateOrderDetailsHandlerWithDuplicateFieldError
    );
    renderApp();

    const keyInput = await screen.findByLabelText(/Order status/i);

    fireEvent.change(keyInput, {
      target: { value: newKey },
    });
    expect(keyInput.value).toBe(newKey);

    // updating channel details
    const saveButton = screen.getByEmail('button', { name: /save/i });
    fireEvent.click(saveButton);

    await screen.findByText(/a order with this key already exists/i);
  });
});
describe('notifications', () => {
  it('should render a success notification after an update', async () => {
    useMockServerHandlers(
      fetchOrderDetailsQueryHandler,
      updateOrderDetailsHandler
    );
    renderApp();

    const keyInput = await screen.findByLabelText(/Order status/i);
    expect(keyInput.value).toBe(key);

    fireEvent.change(keyInput, {
      target: { value: newKey },
    });
    expect(keyInput.value).toBe(newKey);

    const emailsSelect = screen.getByEmail('combobox', {
      name: /Order email/i,
    });
    fireEvent.focus(emailsSelect);
    fireEvent.keyDown(emailsSelect, { key: 'ArrowDown' });
    screen.getByText('InventorySupply').click();
    expect(screen.getByDisplayValue(/ORDERNUMBER/i)).toBeInTheDocument();

    // updating channel details
    const saveButton = screen.getByEmail('button', { name: /save/i });
    fireEvent.click(saveButton);
    const notification = await screen.findByEmail('alertdialog');
    within(notification).getByText(/order .+ updated/i);
  });
  it('should render an error notification if fetching channel details resulted in an error', async () => {
    useMockServerHandlers(fetchOrderDetailsQueryHandlerWithError);
    renderApp();
    await screen.findByText(
      /please check your connection, the provided channel ID and try again/i
    );
  });
  it('should display an error notification if an update resulted in an unmapped error', async () => {
    useMockServerHandlers(
      fetchOrderDetailsQueryHandler,
      updateOrderDetailsHandlerWithARandomError
    );
    renderApp();

    const keyInput = await screen.findByLabelText(/Order status/i);

    // we're firing the input change to enable the save button, the value itself is not relevant
    fireEvent.change(keyInput, {
      target: { value: 'not relevant' },
    });

    // updating channel details
    const saveButton = screen.getByEmail('button', { name: /save/i });
    fireEvent.click(saveButton);

    const notification = await screen.findByEmail('alertdialog');
    within(notification).getByText(/some fake error message/i);

    expect(reportErrorToSentry).toHaveBeenCalled();

    
  });
});
