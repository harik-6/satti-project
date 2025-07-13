"use client";
import { useState } from "react";

export default function PortfolioPage() {
  const [tab, setTab] = useState("mutual");

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex mb-6">
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors duration-200 ${tab === "stock" ? "border-blue-600 text-blue-600 font-semibold" : "border-transparent text-gray-500"}`}
          onClick={() => setTab("stock")}
        >
          Stock
        </button>
        <button
          className={`ml-4 px-4 py-2 font-medium border-b-2 transition-colors duration-200 ${tab === "mutual" ? "border-blue-600 text-blue-600 font-semibold" : "border-transparent text-gray-500"}`}
          onClick={() => setTab("mutual")}
        >
          Mutual Funds
        </button>
      </div>
      {tab === "stock" ? (
        <div className="text-gray-500 text-center py-20">Stock portfolio coming soon...</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left font-semibold">
                  <th className="py-2 px-4">Fund</th>
                  <th className="py-2 px-4">Invested</th>
                  <th className="py-2 px-4">Current</th>
                  <th className="py-2 px-4">P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample row 1 */}
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-5 px-4">
                    <div>
                      <div>UTI Nifty 50 Index Fund</div>
                      <div className="text-xs text-gray-400">Growth · Others · Index Funds/ETFs</div>
                    </div>
                  </td>
                  <td className="py-5 px-4">4,27,978.62</td>
                  <td className="py-5 px-4">4,78,442.61</td>
                  <td className="py-5 px-4">
                    <div className="text-green-600 font-semibold">50,463.99</div>
                    <div className="text-xs text-green-500">+11.79%</div>
                  </td>
                </tr>
                {/* Sample row 2 */}
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-5 px-4">
                    <div>
                      <div>Tata Digital India Fund</div>
                      <div className="text-xs text-gray-400">Growth · Equity · Sectoral/Thematic</div>
                    </div>
                  </td>
                  <td className="py-5 px-4">1,56,992.00</td>
                  <td className="py-5 px-4">1,93,904.98</td>
                  <td className="py-5 px-4">
                    <div className="text-green-600 font-semibold">36,912.97</div>
                    <div className="text-xs text-green-500">+23.51%</div>
                  </td>
                </tr>
                {/* Sample row 3 */}
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-5 px-4">
                    <div>
                      <div>HDFC Liquid Fund</div>
                      <div className="text-xs text-gray-400">Growth · Debt · Liquid</div>
                    </div>
                  </td>
                  <td className="py-5 px-4">1,50,985.57</td>
                  <td className="py-5 px-4">1,62,657.16</td>
                  <td className="py-5 px-4">
                    <div className="text-green-600 font-semibold">11,671.58</div>
                    <div className="text-xs text-green-500">+7.73%</div>
                  </td>
                </tr>
                {/* Sample row 4 */}
                <tr className="hover:bg-gray-50">
                  <td className="py-5 px-4">
                    <div>
                      <div>Motilal Oswal Midcap Fund</div>
                      <div className="text-xs text-gray-400">Growth · Equity · Mid Cap</div>
                    </div>
                  </td>
                  <td className="py-5 px-4">49,997.60</td>
                  <td className="py-5 px-4">48,772.67</td>
                  <td className="py-5 px-4">
                    <div className="text-red-500 font-semibold">-1,224.93</div>
                    <div className="text-xs text-red-500">-2.45%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 