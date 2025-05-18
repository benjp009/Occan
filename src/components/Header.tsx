import React     from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Button';


export function Header({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <header className="header">
      <Container sx={{ display: 'flex', alignItems: 'right', gap: 2 }}>
        {/* Logo placeholder */}
        <div>Logo</div>
        
        {/* Search bar */}
        <div>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        
        {/* CTA */}
        <Button variant="contained" color="primary">
          Ajouter votre produit
        </Button>
      </Container>
    </header>
  );
}