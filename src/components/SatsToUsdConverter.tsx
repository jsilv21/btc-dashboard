import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SATS_PER_BTC, formatDollars } from "@/utils/constants";

interface PriceData {
  [currency: string]: number;
}

export default function SatsToUsdConverter() {
  const [sats, setSats] = useState<number | undefined>(1000);
  const [usd, setUsd] = useState<number | undefined>(0.01);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const response = await fetch("https://mempool.space/api/v1/prices");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PriceData = await response.json();
        setBtcPrice(data.USD);
        if (sats !== undefined) {
          setUsd(satsToUsd(sats, data.USD));
        }
      } catch (e: any) {
        setError(`Failed to fetch BTC price: ${e.message}`);
        console.error(e);
      }
    };

    fetchBtcPrice();
  }, [sats]);

  const satsToUsd = (sats: number, btcPrice: number | null): number => {
    if (!btcPrice) return 0;
    return (sats / SATS_PER_BTC) * btcPrice;
  };

  const usdToSats = (usd: number, btcPrice: number | null): number => {
    if (!btcPrice) return 0;
    return (usd / btcPrice) * SATS_PER_BTC;
  };

  const handleSatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSats = parseFloat(e.target.value);
    setSats(newSats);
    if (btcPrice) {
      setUsd(satsToUsd(newSats, btcPrice));
    }
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsd = parseFloat(e.target.value);
    setUsd(newUsd);
    if (btcPrice) {
      setSats(usdToSats(newUsd, btcPrice));
    }
  };

  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      <CardHeader>
        <CardTitle>Sats to USD Converter</CardTitle>
        <CardDescription>
          $1 is worth {usdToSats(1, btcPrice).toFixed(0)} satoshis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="sats">Sats</Label>
          <Input
            type="number"
            id="sats"
            placeholder="Enter sats"
            value={sats !== undefined ? sats.toString() : ""}
            onChange={handleSatsChange}
          />
        </div>
        <div>
          <Label htmlFor="usd">USD</Label>
          <Input
            type="number"
            id="usd"
            placeholder="Enter USD"
            value={usd !== undefined ? usd.toString() : ""}
            onChange={handleUsdChange}
          />
        </div>
        {btcPrice && (
          <p className="text text-sm text-muted-foreground">
            Using cached BTC Price: {formatDollars(btcPrice)}
          </p>
        )}
      </CardContent>
    </>
  );
}
