import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function OrderSummary() {
  const { subtotal, discount, discountRate, shipping, grandTotal } = useCart();
  const { darkMode } = useTheme();

  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const rows: [string, string][] = [
    ['Subtotal', `$${subtotal.toFixed(2)}`],
    [`Discount(${Math.round(discountRate * 100)}%)`, `-$${discount.toFixed(2)}`],
    ['Shipping', `$${shipping.toFixed(2)}`],
    ['Grand Total', `$${grandTotal.toFixed(2)}`],
  ];

  return (
    <section
      aria-label="Order Summary"
      className={`${darkMode ? 'bg-gray-800 border-gray-700 text-light' : 'bg-white border-gray-200 text-gray-800'} rounded-lg border shadow-lg overflow-hidden`}
    >
      <h2 className="text-2xl font-bold text-center py-4">Order Summary</h2>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label} className={`grid grid-cols-2 border-t ${border} text-center`}>
            <dt className="font-semibold py-3">{label}</dt>
            <dd className={`py-3 border-l ${border}`}>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="p-4">
        <button
          type="button"
          className="w-full bg-primary hover:bg-accent text-white py-3 rounded-full transition-colors"
        >
          Proceed To Checkout
        </button>
      </div>
    </section>
  );
}
