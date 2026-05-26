import { initials } from '../../utils/formatters';

interface Props { name: string; avatar?: string | null; size?: 'sm' | 'md' | 'lg'; }

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' };

export function Avatar({ name, avatar, size = 'md' }: Props) {
  if (avatar) return <img src={`http://localhost:3001${avatar}`} alt={name} className={`${sizes[size]} rounded-full object-cover`} />;
  return (
    <div className={`${sizes[size]} rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold`}>
      {initials(name)}
    </div>
  );
}
