import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import OrderSummary from './OrderSummary';

export default function Cart() {
  const { items, updateQuantity, removeItem, applyCoupon } = useCart();
  const { darkMode } = useTheme();
  const [coupon, setCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const text = darkMode ? 'text-light' : 'text-gray-800';
  const panel = `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-lg overflow-hidden`;
  const cell = `${darkMode ? 'border-gray-700' : 'border-gray-200'} border px-3 py-3 text-center`;

  const handleCoupon = (e: FormEvent) => {
    e.preventDefault();
    const ok = applyCoupon(coupon);
    setCouponMessage({ ok, text: ok ? 'Coupon applied: 5% off.' : 'Invalid coupon code.' });
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${text}`}>Shopping Cart</h1>

        {items.length === 0 ? (
          <div className={`${panel} py-20 text-center`} role="status">
            <p className={`${text} text-lg font-medium`}>Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block mt-4 bg-primary hover:bg-accent text-white px-6 py-2 rounded-full transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className={`${panel} lg:col-span-2`}>
              <div className="overflow-x-auto">
                <table className={`w-full ${text}`}>
                  <thead>
                    <tr className="font-bold">
                      <th className={cell}>S. No.</th>
                      <th className={cell}>Product Image</th>
                      <th className={cell}>Product Name</th>
                      <th className={cell}>Unit Price</th>
                      <th className={cell}>Quantity</th>
                      <th className={cell}>Total</th>
                      <th className={cell}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.productId} className="font-semibold">
                        <td className={cell}>{index + 1}</td>
                        <td className={cell}>
                          <img
                            src={`/${item.imgName}`}
                            alt={item.name}
                            width={96}
                            height={64}
                            className="h-16 w-24 object-contain mx-auto"
                          />
                        </td>
                        <td className={cell}>{item.name}</td>
                        <td className={cell}>${item.unitPrice.toFixed(2)}</td>
                        <td className={cell}>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.productId, Math.floor(Number(e.target.value)))
                            }
                            aria-label={`Quantity of ${item.name}`}
                            className={`w-16 text-center rounded-lg border py-2 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none ${darkMode ? 'bg-gray-900 border-gray-700 text-light' : 'bg-white border-gray-300'}`}
                          />
                        </td>
                        <td className={cell}>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                        <td className={cell}>
                          <button
                            onClick={() => removeItem(item.productId)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="text-primary hover:text-red-500 transition-colors"
                          >
                            <svg
                              className="h-5 w-5 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 5v6m4-6v6" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <form onSubmit={handleCoupon} className="flex flex-wrap items-center gap-3 p-3">
                <div className="flex flex-grow max-w-sm">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon Code"
                    aria-label="Coupon code"
                    className={`flex-grow min-w-0 px-4 py-2 rounded-l-full border focus:border-primary focus:outline-none ${darkMode ? 'bg-gray-900 border-gray-700 text-light' : 'bg-white border-gray-300'}`}
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-r-full transition-colors"
                  >
                    Apply Coupon
                  </button>
                </div>
                {couponMessage && (
                  <p
                    role="status"
                    className={couponMessage.ok ? 'text-primary text-sm' : 'text-red-500 text-sm'}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </form>
            </div>
            <OrderSummary />
          </div>
        )}
      </div>
    </div>
  );
}
