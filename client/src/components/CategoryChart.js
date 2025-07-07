import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666', '#66CCFF', '#FFD700'];

const RADIAN = Math.PI / 180;

// Função para renderizar os rótulos com os valores DENTRO das fatias
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // Posição central dentro da fatia
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Renderiza o rótulo apenas se a fatia for maior que 8% para evitar sobreposição
  if (percent * 100 > 8) {
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="11px" fontWeight="600">
        {`R$ ${value.toFixed(2)}`}
      </text>
    );
  }
  return null;
};

// Função para renderizar o conteúdo central do gráfico de rosca
const renderCenterContent = (data, textColorPrimary) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const categoryCount = data.length;
  
  return (
    <g>
      <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fontSize="14px" fontWeight="600" fill={textColorPrimary}>
        Total
      </text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize="18px" fontWeight="700" fill={textColorPrimary}>
        R$ {total.toFixed(2)}
      </text>
      <text x="50%" y="75%" textAnchor="middle" dominantBaseline="middle" fontSize="12px" fill={textColorPrimary}>
        {categoryCount} {categoryCount === 1 ? 'categoria' : 'categorias'}
      </text>
    </g>
  );
};

function CategoryChart({ data, textColorPrimary, textColorSecondary }) {
  // Se não há dados, mostra uma mensagem
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: 300, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--surface-color)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', color: textColorSecondary }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>Nenhuma despesa registrada</div>
          <div style={{ fontSize: '14px', marginTop: '5px' }}>Adicione despesas para ver o gráfico</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: 350,
      backgroundColor: 'var(--surface-color)',
      borderRadius: 'var(--border-radius)',
      padding: '20px',
      boxShadow: 'var(--box-shadow)'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: textColorPrimary,
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Distribuição por Categoria
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%" // Cria o efeito de rosca
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
            paddingAngle={2} // Espaçamento entre as fatias
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="var(--surface-color)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          
          {/* Conteúdo central do gráfico de rosca */}
          {renderCenterContent(data, textColorPrimary)}
          
          <Tooltip 
            formatter={(value, name) => [`R$ ${value.toFixed(2)}`, name]}
            contentStyle={{
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: textColorPrimary
            }}
          />
          
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              paddingTop: '10px',
              color: textColorPrimary
            }}
            formatter={(value, entry) => (
              <span style={{ color: textColorPrimary, fontSize: '12px' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;
