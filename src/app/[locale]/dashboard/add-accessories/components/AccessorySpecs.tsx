"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { updateField } from "@/redux/modules/addAccessories/slice";
import { selectAccessory } from "@/redux/modules/addAccessories/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function AccessorySpecs({ dict, isRTL }: { dict: any; isRTL: boolean }) {
  const dispatch = useAppDispatch();
  const accessory = useAppSelector(selectAccessory);
  const [newDevice, setNewDevice] = useState("");

  const handleAddDevice = () => {
    if (newDevice.trim() && !accessory.compatible_devices?.includes(newDevice.trim())) {
      const updatedDevices = [...(accessory.compatible_devices || []), newDevice.trim()];
      dispatch(updateField({ field: "compatible_devices", value: updatedDevices }));
      setNewDevice("");
    }
  };

  const handleRemoveDevice = (deviceToRemove: string) => {
    const updatedDevices =
      accessory.compatible_devices?.filter((device) => device !== deviceToRemove) || [];
    dispatch(updateField({ field: "compatible_devices", value: updatedDevices }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDevice();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.compatibleDevices}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Add Device Input */}
        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Input
            value={newDevice}
            onChange={(e) => setNewDevice(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`${dict.addDevice}...`}
            className="flex-1"
            dir={isRTL ? "rtl" : "ltr"}
          />
          <Button type="button" onClick={handleAddDevice} disabled={!newDevice.trim()} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Devices */}
        {accessory.compatible_devices && accessory.compatible_devices.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Devices:</Label>
            <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}>
              {accessory.compatible_devices.map((device, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span>{device}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDevice(device)}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!accessory.compatible_devices || accessory.compatible_devices.length === 0) && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No compatible devices added yet. Add devices above.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
