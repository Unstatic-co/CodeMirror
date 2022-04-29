export const formulaTags = {
  Products: {
    key: 'products',
    type: 'table',
    properties: null
  },
  Cars: {
    key: 'products',
    type: 'card',
    properties: null
  },
  CurrentValue: {
    key: 'currentvalue',
    type: 'currentvalue',
    properties: {
      Date: {
        key: 'date',
        type: 'string'
      },
      Discount: {
        key: 'discount',
        type: 'number'
      },
      Name: {
        key: 'Name',
        type: 'string'
      },
      Price: {
        key: 'Price',
        type: 'number'
      }
    }
  },
  CurrentUser: {
    key: 'currentuser',
    type: 'currentuser',
    properties: {
      Name: {
        key: 'Name',
        type: 'string'
      }
    }
  },
  predicate: {
    key: 'placeholder',
    type: 'placeholder',
    properties: null
  }
  
}