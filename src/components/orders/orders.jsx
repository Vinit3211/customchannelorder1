import PropTypes, { string } from 'prop-types';
import { lazy, useState } from 'react';
import { useIntl } from 'react-intl';
import PrimaryButton from '@commercetools-uikit/primary-button';
import {
  Link as RouterLink,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { BackIcon } from '@commercetools-uikit/icons';
import Constraints from '@commercetools-uikit/constraints';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import messages from './messages';
 import { useOrdersFetcher } from '../../hooks/use-orders-connector';
import { getErrorMessage } from '../../helpers.js';
import { getByPlaceholderText } from '@testing-library/react';


const OrderDetails = lazy(() => import('../order-details'));


const columns = [
  { key: 'orderNumber', label: 'Order number ' },
  { key: 'orderState', label: 'Order status',isSortable: true },
  { key: 'customerEmail', label: 'Order email' },
  { key: 'createdAt', label: 'Order createdAt' },
  { key: 'lastModifiedAt', label: 'Order lastModifiedAt' },
   //{ key: columns.quantity,flexGrow: 1, label: 'Order quantity' }

];




const itemRenderer = (item, column, dataLocale, projectLanguages) => {

  switch (column.key) {
    case 'email':
      return item.number.join(', '); 
  
    case 'number':
      return formatLocalizedString(
        { name: transformLocalizedFieldToLocalizedString(item.nameAllLocales) },
        {
          key: 'number',
          locale: dataLocale,
          fallbackOrder: projectLanguages,
          fallback: NO_VALUE_FALLBACK,
        }
      );
    default:
      return item[column.key];
  }
};




const Orders = (props) => {
  const intl = useIntl();
  const match = useRouteMatch ();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'orderState', order: 'asc' });
  let[searchTerm,setSearchTerm]=useState("");
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project.languages,
  }));
  const { ordersPaginatedResult, error, loading } = useOrdersFetcher({
    page,
    perPage,
    tableSorting,
    
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  const allMovies = ordersPaginatedResult?.results.filter((value) => {
  if (searchTerm === '') {
    return value;
  } else if (value.customerEmail.includes(searchTerm)) {
    return value;
  }
  else if (value.orderState.toLowerCase()
    .includes(searchTerm)) {
    return value;
  }

  // else if (value.orderNumber
  //   .includes(searchTerm)) {
  //   return value;
  // }
})

//   const filteredStudent = () => {
//     return ordersPaginatedResult?.results && searchTerm !== "" ? ordersPaginatedResult?.results.filter(student => student.customerEmail[0].startsWith(searchTerm.toLowerCase()) || student.orderNumber.startsWith(searchTerm.toLowerCase())) : students;
// }
// console.log(filteredStudent,"filter")
 
      
    
  
  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
      <p align="right">
        <PrimaryButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          onClick={() => alert('Button clicked')}
          icon={<BackIcon />}
        />
        </p> 
        <Text.Headline as="h2" intlMessage={messages.title}  
        />
          

      </Spacings.Stack>

      <Constraints.Horizontal max={15}>
        <ContentNotification type="info">
          <Text.Body intlMessage={messages.demoHint} />
        </ContentNotification>
      </Constraints.Horizontal>

      {loading && <LoadingSpinner />}

      
{
    <div>
    
    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." />
      <button onClick={(e) => {
     setSearchTerm(allMovies);
  }} >Search</button>
    </div> }

       <p align="right">
      <button >Add Orders</button>
      </p> 

     {
      console.log(ordersPaginatedResult,"string")}
      {
      console.log(allMovies,"allMovies")
     }

      {ordersPaginatedResult ? (
        <Spacings.Stack scale="xl">
          
          <DataTable
            isCondensed
            columns={columns}
            rows={allMovies}
            itemRenderer={(item, column) =>
              itemRenderer(item, column, dataLocale, projectLanguages)
            }
            maxHeight={200}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
            onRowClick={(row) => push(`${match.url}/${row.id}`)}
          />
        

          <div>{
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={ordersPaginatedResult.total}
          />
        }</div>
          <Switch>
            <SuspendedRoute path={`${match.path}/:id`}>
              <OrderDetails onClose={() => push(`${match.url}`)} />
              
            </SuspendedRoute>
          </Switch>
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};
Orders.displayName = 'Orders';
Orders.propTypes = {
  linkToWelcome: PropTypes.string.isRequired,
};

export default Orders;
