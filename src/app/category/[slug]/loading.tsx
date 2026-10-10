export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="h-44 bg-[#E7E7E7] animate-pulse rounded-2xl mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-[#E7E7E7] rounded-2xl h-64 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
