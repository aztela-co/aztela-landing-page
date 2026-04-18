import IndustryPage from "@/components/IndustryPage";
import WholesalerGraphic from "@/components/graphics/WholesalerGraphic";

export const metadata = {
  title: "Aztela for Wholesalers — SKU Intelligence, Pricing Sync & Margin Protection",
  description: "Aztela helps wholesalers stop losing margin to pricing lag, dead stock, and buying decisions made without real data.",
};

export default function WholesalersPage() {
  return (
    <IndustryPage
      badge="Built for Wholesalers"
      headline="Your margin is leaking. You know it. You just can't see exactly where."
      subhead="Wholesalers operate on thin margins with complex supplier networks and unpredictable demand. Aztela gives you SKU-level intelligence, real-time landed cost, and automated pricing sync — so every buying and pricing decision is grounded in data you can trust."
      whoTitle="For wholesalers managing high SKU counts across multiple supplier relationships."
      whoBody="You're buying from dozens of suppliers, selling to hundreds of customers, and managing thousands of SKUs — all while protecting margins that don't leave room for error. Your buying decisions drive everything, but they're still largely based on experience and relationships rather than live data."
      whoRoles={[
        "Director of Purchasing — managing supplier relationships and buy decisions across the full catalog",
        "VP of Sales & Operations — accountable for margin, turns, and customer fill rate",
        "Pricing Manager — trying to stay current with supplier cost changes across thousands of lines",
        "CFO / COO — watching working capital tied up in the wrong inventory",
      ]}
      pains={[
        {
          urgency: "Margin committed before you knew the real cost",
          title: "You won the job. The invoice arrived 6 weeks later and wiped the margin out.",
          body: "You quoted based on last month's cost. The supplier had already moved pricing. The PO went out, the job got done, and the profit evaporated when the invoice landed. It happens across dozens of lines every month and nobody catches it until the damage is already done.",
        },
        {
          urgency: "$2M supplier renewal. 6 of 8 orders late.",
          title: "You just renewed a major supplier who's been quietly failing you.",
          body: "You knew something felt off. But in the room, they had the relationship and you had a feeling. No consolidated on-time data, no cost trend, no performance history to point to. You signed. A buyer with the numbers would have negotiated 12% savings or walked.",
        },
        {
          urgency: "Best customers learning to call competitors first",
          title: "Your fastest movers stockout. Customers stop asking and start going elsewhere.",
          body: "Capital is locked in product lines that haven't moved in 9 months while your top revenue drivers keep running dry. Customers don't complain after the second or third time — they just quietly split their spend. By the time you notice, the habit is already formed.",
        },
        {
          urgency: "Structural margin leakage every single quarter",
          title: "Your prices are built on cost data that's already out of date by the time you use it.",
          body: "Freight surcharges, duty changes, supplier adjustments — none of it lands in your pricing until weeks after the fact. You're selling at margins calculated on last quarter's reality. The gap between what you think you're making and what you actually make widens every cycle.",
        },
      ]}
      goals={[
        {
          title: "Buy the right products in the right quantities.",
          body: "Know exactly which SKUs are trending up, which are dying, and how much of each to buy. Turn buying from art into science — without replacing the judgment your team has built over years.",
        },
        {
          title: "Price with confidence — every time.",
          body: "Landed cost calculated at PO time, not reconciled 6 weeks later. Supplier price changes reflected same-day. Quote with accuracy and protect your margin before it walks out the door.",
        },
        {
          title: "Know where your supplier risk lives before it bites you.",
          body: "Consolidated supplier scorecards: on-time rates, cost trends, quality flags. Understand your exposure and know exactly where to push back in your next negotiation.",
        },
      ]}
      solutions={[
        {
          title: "SKU-Level Demand Intelligence",
          body: "Real-time velocity tracking for every SKU. Know what's trending, what's dying, and the precise optimal buy quantity for each — updated continuously with actual sales data.",
          outcomes: ["Dead stock ratio ↓ 40%", "Stockout rate ↓ 28%", "Inventory ROI ↑ 33%"],
        },
        {
          title: "Real-Time Landed Cost Engine",
          body: "Every cost component calculated at PO time. Freight, duties, surcharges — all modeled before you commit. No more pricing surprises 6 weeks after the invoice arrives.",
          outcomes: ["Pricing accuracy ↑ 94%", "Margin leakage eliminated", "Invoice disputes ↓ 78%"],
        },
        {
          title: "Automated Supplier Price Sync",
          body: "Supplier price changes detected and staged in your system same-day via automated feed monitoring. Your pricing team stops chasing updates and starts managing exceptions.",
          outcomes: ["Pricing lag: weeks → same day", "Margin erosion ↓ to near zero", "6 hrs/week saved per pricing analyst"],
        },
      ]}
      graphic={<WholesalerGraphic />}
    />
  );
}
