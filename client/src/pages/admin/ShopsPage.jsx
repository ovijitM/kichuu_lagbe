import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Badge } from "../../components/Badge.jsx";
import { Button } from "../../components/Button.jsx";
import { TextInput } from "../../components/Field.jsx";

const filters = ["pending", "approved", "rejected", "all"];
const tone = { pending: "amber", approved: "mint", rejected: "slate" };

export function AdminShopsPage() {
  const [status, setStatus] = useState("pending");
  const [shops, setShops] = useState([]);
  const [reasons, setReasons] = useState({});
  const [error, setError] = useState("");

  async function load(nextStatus = status) {
    const query = nextStatus === "all" ? "" : `?status=${nextStatus}`;
    const { shops: nextShops } = await api(`/api/admin/shops${query}`);
    setShops(nextShops);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, [status]);

  async function decide(shop, approvalStatus) {
    setError("");
    const rejectionReason = reasons[shop.id] || "";
    try {
      await api(`/api/admin/shops/${shop.id}`, {
        method: "PATCH",
        body: { approvalStatus, rejectionReason },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Shops</h1>
      <p className="mt-1 text-sm text-muted">Approve shops before residents in Bashundhara can see them.</p>
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${status === filter ? "bg-primary text-white" : "bg-white text-muted"}`}
            onClick={() => setStatus(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <ul className="mt-6 flex flex-col gap-3">
        {shops.map((shop) => (
          <li key={shop.id} className="rounded-surface border border-line bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">{shop.name}</h2>
                <p className="text-sm text-muted">
                  Block {shop.block} · {shop.owner?.name} · {shop.owner?.email}
                  {shop.isOpen ? " · open" : " · closed"}
                </p>
              </div>
              <Badge tone={tone[shop.approvalStatus]}>{shop.approvalStatus}</Badge>
            </div>
            {shop.rejectionReason ? <p className="mt-2 text-sm text-amber-deep">{shop.rejectionReason}</p> : null}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button type="button" onClick={() => decide(shop, "approved")}>Approve</Button>
              <TextInput
                placeholder="Reason if rejecting"
                value={reasons[shop.id] || ""}
                onChange={(event) => setReasons({ ...reasons, [shop.id]: event.target.value })}
              />
              <Button type="button" variant="secondary" onClick={() => decide(shop, "rejected")}>Reject</Button>
            </div>
          </li>
        ))}
        {shops.length === 0 ? <li className="text-sm text-muted">No shops in this list.</li> : null}
      </ul>
    </div>
  );
}
