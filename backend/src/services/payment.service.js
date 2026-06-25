// Preparado para integrar Stripe, Azul, PayPal u otro proveedor de pagos.
export async function createPaymentIntent(order){ return { status:'prepared', provider:'mock', order }; }
