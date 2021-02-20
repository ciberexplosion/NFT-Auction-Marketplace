import React from 'react';
import { MDBDataTable } from 'mdbreact';

const DatatablePage = () => {
  const data = {
    columns: [
      {
        label: 'Name',
        field: 'name',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Owner',
        field: 'owner',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Price',
        field: 'price',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Start date',
        field: 'created',
        sort: 'asc',
        width: 150
      },      
      {
        label: 'Expiry',
        field: 'expiry',
        sort: 'asc',
        width: 100
      }
    ],
    rows: [
      {
        name: 'Tiger Nixon',
        owner: 'System Architect',
        price: 'Edinburgh',
        created: '61',
        expiry: '2011/04/25'
      }
    ]
  };

  return (
    <MDBDataTable
      striped
      bordered
      small
      data={data}
    />
  );
}

export default DatatablePage;