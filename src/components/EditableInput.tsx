import { Input } from '@/components/ui/input';

export const EditableInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
};
