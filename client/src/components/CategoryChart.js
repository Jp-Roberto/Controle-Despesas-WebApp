import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell, LabelList } from 'recharts';
import Card from './ui/Card';
import Button from './ui/Button';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666', '#66CCFF', '#FFD700'];

// Label customizado: dentro da barra se grande, ao lado se pequena
function InsideOrOutsideBarLabel({ x, y, width, height, value, index, layout }) {
  // minSize: tamanho mínimo para decidir se o label fica dentro ou fora da barra
  const minSize = 32;
  const label = `R$ ${value.toFixed(2)}`;
  let posX, posY, fill, anchor;
  if (layout === 'vertical') {
    if (width < minSize) {
      // Fora da barra, à direita
      posX = x + width + 8;
      posY = y + height / 2 + 2;
      fill = '#23213a';
      anchor = 'start';
    } else {
      // Dentro da barra
      posX = x + width / 2;
      posY = y + height / 2 + 2;
      fill = '#fff';
      anchor = 'middle';
    }
  } else {
    if (height < minSize) {
      // Fora da barra, acima
      posX = x + width / 2;
      posY = y - 6;
      fill = '#23213a';
      anchor = 'middle';
    } else {
      // Dentro da barra
      posX = x + width / 2;
      posY = y + height / 2 + 2;
      fill = '#fff';
      anchor = 'middle';
    }
  }
  return (
    <text
      x={posX}
      y={posY}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontSize={13}
      fontWeight={600}
      fill={fill}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      {label}
    </text>
  );
}

function CategoryChart({ data, textColorPrimary, textColorSecondary, card = true }) {
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [fade, setFade] = useState(true);
  const layout = isHorizontal ? 'vertical' : 'horizontal';
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 700;

  // Animação de transição do gráfico
  const handleToggle = () => {
    setFade(false);
    setTimeout(() => {
      setIsHorizontal((h) => !h);
      setFade(true);
    }, 220); // tempo igual ao transition
  };

  // Mensagem quando não há dados para o gráfico
  const chartContent = !data || data.length === 0 ? (
    <div style={{
      width: '100%',
      height: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-surface, #fff)',
      borderRadius: 'var(--radius-lg, 24px)',
      border: '1px solid var(--color-border, #e0e0e0)'
    }}>
      <div style={{ textAlign: 'center', color: textColorSecondary }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
        <div style={{ fontSize: '16px', fontWeight: '500' }}>Nenhuma despesa registrada</div>
        <div style={{ fontSize: '14px', marginTop: '5px' }}>Adicione despesas para ver o gráfico</div>
      </div>
    </div>
  ) : (
    <div className="category-chart-modern" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        gap: 12
      }}>
        <span style={{
          color: textColorPrimary,
          fontSize: '18px',
          fontWeight: '600',
        }}>
          Distribuição por Categoria
        </span>
        <Button
          variant="ghost"
          style={{ fontSize: 14, padding: '0.4rem 1.1rem', borderRadius: 16 }}
          onClick={handleToggle}
        >
          {isHorizontal ? 'Gráfico Vertical' : 'Gráfico Horizontal'}
        </Button>
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          transition: 'opacity 0.22s, transform 0.22s',
          opacity: fade ? 1 : 0,
          transform: fade ? 'scale(1)' : 'scale(0.97)',
          willChange: 'opacity, transform',
          display: 'flex',
        }}
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            layout={layout}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            barCategoryGap={"20%"}
          >
            {isHorizontal ? (
              <>
                <XAxis type="number" stroke={textColorSecondary} tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke={textColorPrimary} tick={{ fontSize: 14, fontWeight: 600 }} axisLine={false} tickLine={false} width={120} />
              </>
            ) : (
              <>
                <XAxis dataKey="name" stroke={textColorPrimary} tick={{ fontSize: 14, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke={textColorSecondary} tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
              </>
            )}
            {!isMobile && (
              <Tooltip
                formatter={(value, name) => [`R$ ${value.toFixed(2)}`, name]}
                contentStyle={{
                  backgroundColor: 'var(--color-surface, #fff)',
                  border: '1px solid var(--color-border, #e0e0e0)',
                  borderRadius: '8px',
                  color: textColorPrimary
                }}
              />
            )}
            {!isMobile && (
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  paddingTop: '10px',
                  color: textColorPrimary
                }}
                formatter={(value, entry) => (
                  <span style={{ color: textColorPrimary, fontSize: '12px' }}>{value}</span>
                )}
              />
            )}
            <Bar
              dataKey="value"
              radius={isHorizontal ? [12, 12, 12, 12] : [12, 12, 0, 0]}
              minPointSize={3}
              fill={COLORS[0]}
              animationDuration={900}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList
                dataKey="value"
                content={(props) => <InsideOrOutsideBarLabel {...props} layout={layout} />}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (card) {
    return <Card style={{ padding: 0, background: 'transparent', boxShadow: 'none' }}>{chartContent}</Card>;
  }
  return chartContent;
}

export default CategoryChart;
