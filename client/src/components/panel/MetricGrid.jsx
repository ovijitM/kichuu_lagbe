export function MetricGrid({ children, columns = 4 }) {
  const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  };

  return (
    <div className={`grid gap-3.5 ${columnClasses[columns] || columnClasses[4]}`}>
      {children}
    </div>
  );
}

