import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666', '#66CCFF', '#FFD700'];

const RADIAN = Math.PI / 180;

// Função para renderizar os rótulos com os valores DENTRO das fatias
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // Posição central dentro da fatia
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Renderiza o rótulo apenas se a fatia for maior que 5% para evitar sobreposição em fatias pequenas
  if (percent * 100 > 5) {
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="10px"> {/* Tamanho da fonte reduzido */}
        {`R$ ${value.toFixed(2)}`}
      </text>
    );
  }
  return null; // Não renderiza o rótulo para fatias muito pequenas
};

function CategoryChart({ data, textColorPrimary, textColorSecondary }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="70%" // Definido como porcentagem para melhor escalabilidade
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel} // Usar o rótulo personalizado
            labelLine={false} // Não exibir as linhas de conexão
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;
