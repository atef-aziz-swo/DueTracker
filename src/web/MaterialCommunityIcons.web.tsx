import React from 'react';

// Simple icon component for web using Unicode symbols
// In production, you'd use a proper icon library like react-icons or @mui/icons-material

const iconMap: {[key: string]: string} = {
  'view-dashboard': '📊',
  'view-dashboard-outline': '📊',
  'chart-bar': '📈',
  'chart-bar-outline': '📈',
  'cog': '⚙️',
  'cog-outline': '⚙️',
  'home': '🏠',
  'home-outline': '🏠',
  'account-group': '👥',
  'account-group-outline': '👥',
  'plus': '➕',
  'check-circle': '✅',
  'alert-circle': '⚠️',
  'clock-outline': '⏰',
  'refresh': '🔄',
  'cash-multiple': '💰',
  'calendar-alert': '📅',
  'history': '🕒',
  'receipt-text-outline': '🧾',
  'circle': '⚫',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

const MaterialCommunityIcons: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000',
  style,
}) => {
  const iconSymbol = iconMap[name] || '❓';
  
  return (
    <span
      style={{
        fontSize: size,
        color,
        lineHeight: 1,
        display: 'inline-block',
        ...style,
      }}
      role="img"
      aria-label={name}>
      {iconSymbol}
    </span>
  );
};

export default MaterialCommunityIcons;
