export default function IndustryCard({ industry }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <img
        src={industry.imageUrl}
        alt={industry.name}
        className="w-full h-32 object-cover rounded-md"
      />
      <h3 className="mt-4 text-lg font-semibold">{industry.name}</h3>
      <p className="text-gray-400">{industry.description}</p>
      <button className="mt-4 w-full bg-blue-600 px-4 py-2 rounded-md">
        Activate
      </button>
    </div>
  );
}
