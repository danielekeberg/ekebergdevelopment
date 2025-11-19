import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

const SITE_TYPES = {
  landing: { label: "Enkel landingsside", basePrice: 5000 },
  business: { label: "Bedriftsnettside (flere sider)", basePrice: 12000 },
  ecommerce: { label: "Nettbutikk", basePrice: 20000 },
  webapp: { label: "Webapp / skreddersydd løsning", basePrice: 30000 },
} as const;

const DESIGN_LEVELS = {
  basic: { label: "Enkel / template-basert", addon: 0 },
  custom: { label: "Tilpasset design", addon: 4000 },
  premium: { label: "Premium design (UI/UX, animasjoner)", addon: 8000 },
} as const;

const FEATURES = [
  { id: "contactForm", label: "Kontaktskjema", price: 1500 },
  { id: "cms", label: "CMS (f.eks. Decap / WordPress)", price: 4000 },
  { id: "blog", label: "Bloggfunksjon", price: 2000 },
  { id: "newsletter", label: "Nyhetsbrev-integrasjon", price: 1500 },
  { id: "ecommerce", label: "Nettbutikk-funksjonalitet", price: 6000 },
  { id: "booking", label: "Booking-system", price: 5000 },
  { id: "multilang", label: "Flerspråklig løsning", price: 3000 },
  { id: "analytics", label: "Google Analytics / tracking", price: 1000 },
] as const;

const MAINTENANCE_PLANS = {
  none: { label: "Ingen vedlikeholdsavtale", monthly: 0 },
  basic: {
    label: "Basispakke (oppdateringer, enkel support)",
    monthly: 500,
  },
  pro: {
    label: "Pro-pakke (løpende support og optimalisering)",
    monthly: 1500,
  },
} as const;

const CONTENT_LEVELS = {
  none: { label: "Kunden leverer alt innhold", addon: 0 },
  assist: {
    label: "Hjelp med tekst og bilder",
    addon: 3000,
  },
  full: {
    label: "Full innholdsproduksjon (tekst, bilder, struktur)",
    addon: 7000,
  },
} as const;

type SiteTypeKey = keyof typeof SITE_TYPES;
type DesignLevelKey = keyof typeof DESIGN_LEVELS;
type MaintenancePlanKey = keyof typeof MAINTENANCE_PLANS;
type ContentLevelKey = keyof typeof CONTENT_LEVELS;
type FeatureId = (typeof FEATURES)[number]["id"];

function formatNOK(amount: number) {
  return amount.toLocaleString("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  });
}

export default function PricingCalculator() {
  const [siteType, setSiteType] = useState<SiteTypeKey>("business");
  const [pages, setPages] = useState<number>(5);
  const [designLevel, setDesignLevel] = useState<DesignLevelKey>("custom");
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureId[]>([]);
  const [maintenancePlan, setMaintenancePlan] =
    useState<MaintenancePlanKey>("basic");
  const [contentLevel, setContentLevel] =
    useState<ContentLevelKey>("assist");
  const [notes, setNotes] = useState<string>("");
  const [oneTimeTotal, setOneTimeTotal] = useState<number>(0)

  const handleFeatureToggle = (id: FeatureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const calculation = useMemo(() => {
    const base = SITE_TYPES[siteType].basePrice;

    const extraPerSide = 800;
    const includedPages = 3;
    const extraPages = Math.max(0, pages - includedPages);
    const pagesCost = extraPages * extraPerSide;

    const designCost = DESIGN_LEVELS[designLevel].addon;

    const featuresCost = selectedFeatures.reduce((sum, id) => {
      const feature = FEATURES.find((f) => f.id === id);
      return feature ? sum + feature.price : sum;
    }, 0);

    const contentCost = CONTENT_LEVELS[contentLevel].addon;

    const oneTimeTotal =
      base + pagesCost + designCost + featuresCost + contentCost;
    setOneTimeTotal(oneTimeTotal);

    const monthlyMaintenance = MAINTENANCE_PLANS[maintenancePlan].monthly;
    const yearlyMaintenance = monthlyMaintenance * 12;

    return {
      base,
      pagesCost,
      designCost,
      featuresCost,
      contentCost,
      oneTimeTotal,
      monthlyMaintenance,
      yearlyMaintenance
    };
  }, [
    siteType,
    pages,
    designLevel,
    selectedFeatures,
    maintenancePlan,
    contentLevel,
  ]);

  const addOffer = async (e:any) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("offers")
      .insert({
        siteType,
        pages,
        designLevel,
        selectedFeatures,
        maintenancePlan,
        contentLevel,
        notes,
        oneTimeTotal
      })
      .select()
      .single()
    if(error) {
      console.error("Error saving offer:", error);
      return;
    }
    console.log(data);
  }

  return (
    <>
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Website Pricing 
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        Estimer prosjektpris før du sender tilbud til kunde.
      </p>
    </div>
    <div className="text-gray-900 flex justify-center py-8 px-4">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-[1.4fr,1fr]">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 lg:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="hidden sm:flex w-full justify-end text-right text-xs text-gray-400">
              <p>Estimater i NOK (eks. mva)</p>
            </div>
          </div>

          <section className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              Type nettside
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(SITE_TYPES).map(([key, value]) => {
                const k = key as SiteTypeKey;
                const isActive = siteType === k;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSiteType(k)}
                    className={`text-left rounded-2xl border px-4 py-3 text-sm cursor-pointer transition
                    ${
                      isActive
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-medium">{value.label}</span>
                      <span className="text-xs text-gray-500">
                        fra {formatNOK(value.basePrice)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Antall sider
              </h2>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={pages}
                  onChange={(e) =>
                    setPages(
                      Math.min(99, Math.max(1, Number(e.target.value) || 1))
                    )
                  }
                  className="w-16 bg-white border border-gray-300 rounded-xl px-2 py-1 text-sm text-center"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                De 3 første sidene er inkludert. Deretter ca. {formatNOK(800)}{" "}
                per ekstra side.
              </p>
            </div>

            <div>
                <h2 className="text-sm font-medium text-gray-700 mb-2">
                    Designnivå
                </h2>
                <select
                value={designLevel}
                onChange={(e) => setDesignLevel(e.target.value as DesignLevelKey)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                {Object.entries(DESIGN_LEVELS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}{" "}
                    {value.addon > 0 ? `(+ ${formatNOK(value.addon)})` : ""}
                  </option>
                ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                    Premium kan inkludere skreddersydd UI/UX, animasjoner og finpuss.
                </p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              Funksjonalitet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {FEATURES.map((feature) => {
                const checked = selectedFeatures.includes(feature.id);
                return (
                  <label
                    key={feature.id}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs sm:text-sm cursor-pointer transition
                    ${
                      checked
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={checked}
                      onChange={() => handleFeatureToggle(feature.id)}
                    />
                    <div className="flex flex-col">
                      <span>{feature.label}</span>
                      <span className="text-[0.7rem] text-gray-500">
                        + {formatNOK(feature.price)}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Innhold
              </h2>
              <select
                value={contentLevel}
                onChange={(e) => setContentLevel(e.target.value as ContentLevelKey)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(CONTENT_LEVELS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}{" "}
                    {value.addon > 0 ? `(+ ${formatNOK(value.addon)})` : ""}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Du kan justere prisene senere etter hva som faktisk lønner seg.
              </p>
            </div>

            <div>
                <h2 className="text-sm font-medium text-gray-700 mb-2">
                    Vedlikeholdsavtale
                </h2>
              <select
                value={maintenancePlan}
                onChange={(e) => setMaintenancePlan(e.target.value as MaintenancePlanKey)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(MAINTENANCE_PLANS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                    {value.monthly > 0
                      ? ` (${formatNOK(value.monthly)}/mnd)`
                      : ""}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Vedlikehold faktureres typisk månedlig eller årlig.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              Notater om kunde / prosjekt (valgfritt)
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Noter krav, spesielle ønsker eller ting du vil huske til tilbudet..."
              className="w-full bg-white border border-gray-300 rounded-2xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </section>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">
              Estimat for prosjekt
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Grunnpris</span>
                <span className="font-medium">{formatNOK(calculation.base)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Sider ({pages} stk, 3 inkludert)
                </span>
                <span className="font-medium">
                  {calculation.pagesCost > 0
                    ? formatNOK(calculation.pagesCost)
                    : "Inkludert"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Designnivå</span>
                <span className="font-medium">
                  {calculation.designCost > 0
                    ? formatNOK(calculation.designCost)
                    : "Inkludert"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Funksjonalitet ({selectedFeatures.length} valgt)
                </span>
                <span className="font-medium">
                  {calculation.featuresCost > 0
                    ? formatNOK(calculation.featuresCost)
                    : "Ingen"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Innhold</span>
                <span className="font-medium">
                  {calculation.contentCost > 0
                    ? formatNOK(calculation.contentCost)
                    : "Kunde leverer"}
                </span>
              </div>

              <div className="border-t border-gray-200 my-3" />

              <div className="flex justify-between items-center">
                <span className="font-medium">
                  Éngangskostnad (prosjekt)
                </span>
                <span className="font-semibold text-blue-600 text-lg">
                  {formatNOK(calculation.oneTimeTotal)}
                </span>
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Vedlikehold (mnd)</span>
                  <span className="font-medium">
                    {calculation.monthlyMaintenance > 0
                      ? formatNOK(calculation.monthlyMaintenance)
                      : "Ingen avtale"}
                  </span>
                </div>
                {calculation.monthlyMaintenance > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Vedlikehold (år)</span>
                    <span className="font-medium">
                      {formatNOK(calculation.yearlyMaintenance)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="mt-6 w-full cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
              onClick={addOffer}
            >
              Lagre tilbud
            </button>

            <p className="text-[0.7rem] text-gray-400 mt-3">
              Dette er kun et estimat.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
