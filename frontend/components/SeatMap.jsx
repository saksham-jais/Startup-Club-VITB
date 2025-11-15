// components/SeatMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

export default function SeatMap({ selectedSeat, setSelectedSeat, bookedSeats, eventTitle }) {
  const [zoom, setZoom] = useState(window.innerWidth < 768 ? 0.4 : 0.6);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef(null);

  const premiumRows = ['N', 'M', 'L'];
  const executiveRows = ['K', 'J', 'H', 'G', 'F', 'E', 'D'];

  const handleSeatClick = (row, col) => {
    const key = `${row}-${col}`;
    if (bookedSeats.has(key)) return;
    setSelectedSeat({ row, col });
  };

  const renderRow = (rowLabel) => {
    const leftCount = premiumRows.includes(rowLabel) ? 8 : 8;
    const rightCount = premiumRows.includes(rowLabel) ? 6 : 8;

    return (
      <div key={rowLabel} className="flex items-center gap-3 my-2">
        <span className="w-8 text-center font-bold text-gray-700">{rowLabel}</span>
        <div className="flex gap-2">
          {Array.from({ length: leftCount }, (_, i) => i + 1).map(col => {
            const key = `${rowLabel}-${col}`;
            const booked = bookedSeats.has(key);
            const selected = selectedSeat?.row === rowLabel && selectedSeat?.col === col;
            return (
              <button
                key={col}
                onClick={() => handleSeatClick(rowLabel, col)}
                disabled={booked}
                className={clsx(
                  'w-10 h-10 rounded-lg text-xs font-bold text-white transition-all',
                  booked ? 'bg-red-500 opacity-60 cursor-not-allowed' :
                  selected ? 'bg-blue-600 scale-110 ring-4 ring-blue-300' :
                  'bg-green-500 hover:bg-green-600 hover:scale-105'
                )}
              >
                {col}
              </button>
            );
          })}
        </div>
        {premiumRows.includes(rowLabel) && <div className="w-20" />}
        <div className="flex gap-2">
          {Array.from({ length: rightCount }, (_, i) => i + leftCount + 1).map(col => {
            const key = `${rowLabel}-${col}`;
            const booked = bookedSeats.has(key);
            const selected = selectedSeat?.row === rowLabel && selectedSeat?.col === col;
            return (
              <button
                key={col}
                onClick={() => handleSeatClick(rowLabel, col)}
                disabled={booked}
                className={clsx(
                  'w-10 h-10 rounded-lg text-xs font-bold text-white transition-all',
                  booked ? 'bg-red-500 opacity-60 cursor-not-allowed' :
                  selected ? 'bg-blue-600 scale-110 ring-4 ring-blue-300' :
                  'bg-green-500 hover:bg-green-600 hover:scale-105'
                )}
              >
                {col}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl">
      <h2 className="text-4xl font-bold text-center text-indigo-800 mb-6">Choose Your Seat</h2>

      <div className="flex justify-center gap-8 mb-6 text-sm">
        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-green-500 rounded"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-blue-600 rounded"></div> Selected</div>
        <div className="flex items-center gap-2"><div className="w-6 h-6 bg-red-500 rounded opacity-60"></div> Booked</div>
      </div>

      <div
        ref={mapContainerRef}
        className="relative overflow-hidden rounded-2xl border-4 border-indigo-200 bg-gray-900 shadow-2xl"
        style={{ height: '560px', cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => {
          if (e.target.tagName === 'BUTTON') return;
          setIsDragging(true);
          setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
        }}
        onMouseMove={(e) => {
          if (!isDragging) return;
          setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.2s'
          }}
        >
          <div className="text-center">
            <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-xl font-bold text-xl">
              PREMIUM ₹230
            </div>
            {premiumRows.map(renderRow)}

            <div className="my-10 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-bold text-xl">
              EXECUTIVE ₹230
            </div>
            {executiveRows.map(renderRow)}

            <div className="mt-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-6 rounded-t-3xl text-2xl font-bold shadow-2xl">
              STAGE
            </div>
          </div>
        </div>
      </div>

      {selectedSeat && (
        <div className="mt-6 p-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl border-2 border-emerald-400 flex justify-between items-center">
          <div className="text-2xl font-bold">Your Seat: <span className="text-emerald-700">{selectedSeat.row}{selectedSeat.col}</span></div>
          <button onClick={() => setSelectedSeat(null)} className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600">
            Change Seat
          </button>
        </div>
      )}
    </section>
  );
}