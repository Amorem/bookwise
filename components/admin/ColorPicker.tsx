import { HexColorInput, HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  value?: string;
  onPickerChange: (color: string) => void;
}

export default function ColorPicker({
  value,
  onPickerChange,
}: ColorPickerProps) {
  return (
    <div className="relative">
      <div className="flex flex-row  items-center">
        <p>#</p>

        <HexColorInput
          color={value}
          onChange={onPickerChange}
          className="hex-input"
        />
      </div>
      <HexColorPicker color={value} onChange={onPickerChange} />
    </div>
  );
}
