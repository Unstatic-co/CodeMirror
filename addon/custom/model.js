export const formulaTags = {
  Products: {
    key: 'products',
    type: 'table',
    properties: null,
    description: 'table'
  },
  Cars: {
    key: 'card',
    type: 'table',
    properties: null,
    description: 'table'
  },
  CurrentValue: {
    key: 'currentvalue',
    type: 'currentvalue',
    description: 'Products row',
    properties: {
      Date: {
        key: 'date',
        type: 'string',
        parent: 'currentvalue'
      },
      Discount: {
        key: 'discount',
        type: 'number',
        parent: 'currentvalue'
      },
      Name: {
        key: 'Name',
        type: 'string',
        parent: 'currentvalue',
        properties: {
          test: {
            key: 'test',
            type: 'string',
            parent: 'currentvalue'
          },
          Name: {
            key: 'Name',
            type: 'string',
            parent: 'currentvalue'
          }
        }
      },
      Price: {
        key: 'Price',
        type: 'number',
        parent: 'currentvalue'
      }
    }
  },
  CurrentUser: {
    key: 'currentuser',
    type: 'currentuser',
    description: 'Products row',
    properties: {
      Name: {
        key: 'Name',
        type: 'string',
        parent: 'currentuser'
      }
    }
  },
  predicate: {
    key: 'placeholder',
    type: 'placeholder',
    properties: null
  }
}