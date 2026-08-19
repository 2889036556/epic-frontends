import { notFound } from "next/navigation";
import { PlanetConsole } from "../components/PlanetConsole";
import { findPlanet, planets } from "../space-data";

export function generateStaticParams() {
  return planets.map((planet) => ({ planet: planet.id }));
}

export default async function PlanetPage({ params }: { params: Promise<{ planet: string }> }) {
  const { planet: planetId } = await params;
  const planet = findPlanet(planetId);
  if (!planet) notFound();
  return <PlanetConsole planet={planet} index={planets.findIndex(({ id }) => id === planet.id)} />;
}
