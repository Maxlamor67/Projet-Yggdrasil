import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectScrollable() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a hour" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Heures</SelectLabel>
          <SelectItem value="0">00h00</SelectItem>
          <SelectItem value="1">01h00</SelectItem>
          <SelectItem value="2">02h00</SelectItem>
          <SelectItem value="3">03h00</SelectItem>
          <SelectItem value="4">04h00</SelectItem>
          <SelectItem value="5">05h00</SelectItem>
          <SelectItem value="6">06h00</SelectItem>
          <SelectItem value="7">07h00</SelectItem>
          <SelectItem value="8">08h00</SelectItem>
          <SelectItem value="9">09h00</SelectItem>
          <SelectItem value="10">10h00</SelectItem>
          <SelectItem value="11">11h00</SelectItem>
          <SelectItem value="12">12h00</SelectItem>
          <SelectItem value="13">13h00</SelectItem>
          <SelectItem value="14">14h00</SelectItem>
          <SelectItem value="15">15h00</SelectItem>
          <SelectItem value="16">16h00</SelectItem>
          <SelectItem value="17">17h00</SelectItem>
          <SelectItem value="18">18h00</SelectItem>
          <SelectItem value="19">19h00</SelectItem>
          <SelectItem value="20">20h00</SelectItem>
          <SelectItem value="21">21h00</SelectItem>
          <SelectItem value="22">22h00</SelectItem>
          <SelectItem value="23">23h00</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
