import React from 'react';
import { View, Text } from 'react-native';
import { Database } from '@/types/database';

type VehicleRow = Database['public']['Tables']['vehicles']['Row'];

interface VehicleSpecGridProps {
  vehicle: Pick<VehicleRow, 'year' | 'displacement' | 'power' | 'torque' | 'transmission' | 'weight'>;
}

export function VehicleSpecGrid({ vehicle }: VehicleSpecGridProps) {
  const items = [
    { l: 'Année', v: vehicle.year != null ? String(vehicle.year) : '—' },
    { l: 'Cylindrée', v: vehicle.displacement ?? '—' },
    { l: 'Puissance', v: vehicle.power != null ? `${vehicle.power} ch` : '—' },
    { l: 'Couple', v: vehicle.torque != null ? `${vehicle.torque} Nm` : '—' },
    { l: 'Transmission', v: vehicle.transmission ?? '—' },
    { l: 'Poids', v: vehicle.weight != null ? `${vehicle.weight} kg` : '—' },
  ];

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
      {items.map((s) => (
        <View
          key={s.l}
          style={{
            width: '47%',
            padding: 14,
            borderRadius: 12,
            backgroundColor: '#111118',
            borderWidth: 1,
            borderColor: '#1E1E2E',
          }}
        >
          <Text
            style={{
              color: '#9594B5',
              fontFamily: 'Inter_600SemiBold',
              fontSize: 10,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {s.l}
          </Text>
          <Text style={{ color: '#F1F0FF', fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16 }}>
            {s.v}
          </Text>
        </View>
      ))}
    </View>
  );
}
