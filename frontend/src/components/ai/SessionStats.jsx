export default function SessionStats({ messages, isLoading }) {
  return (
    <div className="border-4 border-black bg-black text-white p-5">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] mb-4">
        Session Stats
      </h3>

      <div className="space-y-2.5 text-xs font-bold">
        <div className="flex justify-between border-b-2 border-white pb-2">
          <span className="uppercase tracking-wide">Queries</span>

          <span className="font-black">
            {messages.filter((m) => m.type === "user").length}
          </span>
        </div>

        <div className="flex justify-between border-b-2 border-white pb-2">
          <span className="uppercase tracking-wide">Insights</span>

          <span className="font-black">
            {messages.filter((m) => m.type === "assistant").length}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="uppercase tracking-wide">Status</span>

          <span className="font-black text-white">
            {isLoading ? "ANALYZING" : "READY"}
          </span>
        </div>
      </div>
    </div>
  );
}
