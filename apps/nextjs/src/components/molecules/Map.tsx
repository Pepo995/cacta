import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { type Establishment } from "@cacta/db";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
  type Libraries,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { env } from "~/env.mjs";
import { Card } from "../atoms/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/SelectInput";

export type MapEstablishment = Pick<Establishment, "id" | "name" | "latitude" | "longitude"> & {
  clicked?: boolean;
};

type MapCardProps = {
  establishments: MapEstablishment[];
  selectedEstablishment?: MapEstablishment;
  setSelectedEstablishment: Dispatch<SetStateAction<MapEstablishment | undefined>>;
};

const LIBRARIES: Libraries = ["drawing", "elevation"];

const MapCard = ({
  establishments,
  selectedEstablishment,
  setSelectedEstablishment,
}: MapCardProps) => {
  const t = useTranslations();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerWindow, setMarkerWindow] = useState<MapEstablishment | null>(null);

  const dropdownValue = useRef(selectedEstablishment?.id);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const handleSelectionChange = (value: string) => {
    dropdownValue.current = value;

    if (value === "allEstablishments") return setSelectedEstablishment(undefined);

    const selectedEstablishment = establishments.find((item) => item.id === dropdownValue.current);
    setSelectedEstablishment(selectedEstablishment);
  };

  const handleMarkerClick = (id: string, name: string, latitude: number, longitude: number) => {
    setMarkerWindow({ id, name, latitude, longitude, clicked: true });
    handleSelectionChange(id);
  };

  const getMarkers = () => (selectedEstablishment ? [selectedEstablishment] : establishments);

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();

      getMarkers().map(({ latitude, longitude }) => {
        bounds.extend({
          lat: latitude,
          lng: longitude,
        });
      });

      map.fitBounds(bounds, 40);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, establishments, selectedEstablishment]);

  return (
    <Card className="flex max-h-[800px] flex-grow flex-col gap-6 p-6">
      <Select value={dropdownValue.current} onValueChange={handleSelectionChange}>
        <SelectTrigger className="h-[40px] w-full">
          <SelectValue placeholder={t("map.allEstablishments")} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="allEstablishments">{t("map.allEstablishments")}</SelectItem>

          {establishments.map(({ name, id }, index) => (
            <SelectItem key={index} value={id}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex h-full w-full items-center justify-center">
        {!isLoaded ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <GoogleMap
            mapContainerClassName="h-full w-full min-h-[200px]"
            onLoad={(map) => {
              map.setOptions({
                maxZoom: 10,
              });

              setMap(map);
            }}
          >
            {getMarkers().map(({ id, name, latitude, longitude }, index) => (
              <MarkerF
                onMouseOver={() =>
                  !markerWindow?.clicked &&
                  setMarkerWindow({ id, name, latitude, longitude, clicked: false })
                }
                onMouseOut={() => !markerWindow?.clicked && setMarkerWindow(null)}
                onClick={() => handleMarkerClick(id, name, latitude, longitude)}
                position={{ lat: latitude, lng: longitude }}
                key={index}
                icon={{
                  url: "/icons/location-pin.svg",
                }}
              >
                {markerWindow?.id === id && (
                  <InfoWindowF
                    onCloseClick={() => {
                      setMarkerWindow(null);
                      handleSelectionChange("allEstablishments");
                    }}
                    position={{
                      lat: latitude,
                      lng: longitude,
                    }}
                  >
                    <p>{name}</p>
                  </InfoWindowF>
                )}
              </MarkerF>
            ))}
          </GoogleMap>
        )}
      </div>
    </Card>
  );
};

export default MapCard;
