export default function Dashboard() {
  const stats = [
    { label: 'Posts Today', value: '3', icon: '📝' },
    { label: 'Scheduled', value: '12', icon: '📅' },
    { label: 'Platforms', value: '6', icon: '🌐' },
    { label: 'AI Credits', value: '∞', icon: '🤖' },
  ];
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}