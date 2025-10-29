// EventBanner.jsx
export function EventBanner() {
  return (
    <div className="relative h-64 w-full flex items-center justify-center overflow-hidden rounded-t-xl shadow">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        alt="Events Banner"
        className="absolute h-full w-full object-cover brightness-75"
      />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-white text-5xl font-extrabold tracking-widest mb-4">EVENTS</h1>
        <p className="text-white text-lg max-w-2xl mx-auto">
          Rise with us to actively engage our community with fellowship and love. Below you will find a list of upcoming events that you can attend, volunteer, and share with others.
        </p>
      </div>
    </div>
  );
}