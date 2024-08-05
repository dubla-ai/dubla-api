export type KirvanoWebhookEvent = {
  event: string;
  event_description: string;
  checkout_id: string;
  sale_id: string;
  payment_method: string;
  total_price: string;
  type: string;
  status: string;
  created_at: string;
  customer: {
    name: string;
    document: string;
    email: string;
    phone_number: string;
  };
  payment: {
    method: string;
    link: string;
    digitable_line: string;
    barcode: string;
    expires_at: string;
  };
  products: [
    {
      id: string;
      name: string;
      offer_id: string;
      offer_name: string;
      description: string;
      price: string;
      photo: string;
      is_order_bump: boolean;
    },
  ];
  utm: {
    src: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term: string;
    utm_content: string;
  };
};
