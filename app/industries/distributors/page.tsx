import IndustryPage from "@/components/IndustryPage";
import DistributorGraphic from "@/components/graphics/DistributorGraphic";

export const metadata = {
  title: "Aztela for Distributors — Real-Time Inventory & Supply Chain Intelligence",
  description: "Aztela solves the exact data problems that cost distributors margin every day: inventory blind spots, supplier delays, and manual reorder chaos.",
};

export default function DistributorsPage() {
  return (
    <IndustryPage
      badge="Built for Distributors"
      headline="You move product across dozens of locations. You shouldn't be flying blind."
      subhead="Distributors lose margin every day to inventory blind spots, supplier surprises, and replenishment decisions made on stale data. Aztela fixes the infrastructure underneath — so you always know what you have, where it is, and what's coming."
      whoTitle="If you're running a multi-location distribution operation, this is built for you."
      whoBody="You're managing inventory across branches, fulfilling customer orders with tight SLAs, and sourcing from a supplier network that doesn't always communicate. Your ERP has data — but it's not the right data at the right time. You're making expensive decisions with incomplete information."
      whoRoles={[
        "VP of Operations — responsible for fill rate, inventory turns, and branch performance",
        "Director of Supply Chain — managing supplier relationships and inbound logistics",
        "Inventory Manager — fighting daily stockouts and overstock simultaneously",
        "COO / General Manager — accountable for margin and working capital",
      ]}
      pains={[
        {
          urgency: "Revenue lost on orders you had stock for",
          title: "You turned down an order. The inventory was in a different branch.",
          body: "A customer calls, your system says zero, you decline or scramble to source elsewhere at full cost. Three days later someone finds the stock sitting in another location. That's a lost sale, a damaged relationship, and an expedite fee — from a problem that didn't need to exist.",
        },
        {
          urgency: "Chargeback landed before the warning did",
          title: "Your supplier slipped two weeks. You found out when the customer escalated.",
          body: "No early signal, no window to reposition. By the time the delay hit your inbox, the customer had already called to complain. You absorbed the expedite freight, ate the chargeback, and had a difficult conversation about whether they'd stay. All of it avoidable with 48 hours of warning.",
        },
        {
          urgency: "Stocked out on your highest-margin SKUs. Again.",
          title: "You ran dry on your best movers during your busiest month.",
          body: "Your reorder logic hasn't moved with demand. Fast movers stockout while slow inventory sits untouched for months. Customers who needed product either paid a premium to get it elsewhere or quietly started spreading their spend. Both outcomes cost you more than a stockout.",
        },
        {
          urgency: "$400K+ in working capital tied up in the wrong inventory",
          title: "Half your warehouse is product you can't move. The other half keeps running out.",
          body: "Every dollar locked in dead stock is a dollar you can't spend on the SKUs that actually sell. The imbalance between overstock and stockout isn't random — it's structural. And it compounds every quarter until someone makes the decision to fix the underlying buying logic.",
        },
      ]}
      goals={[
        {
          title: "Know your inventory position everywhere, always.",
          body: "One live view across all branches, all SKUs, all locations. No calls, no exports, no guessing. The number you see is the number you can trust.",
        },
        {
          title: "Stop absorbing supplier surprises.",
          body: "Get 48 hours of warning before a supplier delay becomes your problem. Know which orders are at risk and what alternatives you have — before the crisis, not during it.",
        },
        {
          title: "Make replenishment decisions that don't require a gut check.",
          body: "Reorder points that reflect today's demand, not last year's. Dynamic, automatic, and accurate — so your buying team is executing, not estimating.",
        },
      ]}
      solutions={[
        {
          title: "Inter-Branch Inventory Intelligence",
          body: "Real-time stock levels across every location in one unified dashboard. Automated transfer recommendations triggered by actual demand signals — not manual observation.",
          outcomes: ["Stockout incidents ↓ 58%", "Overstock exposure ↓ 34%", "Transfer cycle time ↓ 70%"],
        },
        {
          title: "Supplier Disruption Radar",
          body: "Automated monitoring of supplier lead times and shipment statuses. 48-hour early warnings with suggested alternatives surfaced before you're out of options.",
          outcomes: ["Reaction lag: 3 days → 4 hours", "Expedited freight costs ↓ 42%", "Fill rate ↑ 15%"],
        },
        {
          title: "Dynamic Reorder Engine",
          body: "Reorder points that update automatically with demand velocity, seasonality, and supplier lead time changes. Your buying team executes — the system does the math.",
          outcomes: ["Spot-buy premiums ↓ 35%", "Dead stock ratio ↓ 28%", "Inventory turns ↑ 22%"],
        },
      ]}
      graphic={<DistributorGraphic />}
    />
  );
}
