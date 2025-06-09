import React, { useState } from 'react';
import SoftwareCardModal from './SoftwareCardModal';

interface CategoryType {
  id: string;
  icon: string;
  name: string;
  description: string;
  count: number;
  // Optional fields for modal display
  visitUrl?: string;
  turnover?: string;
  creationDate?: string;
  employees?: string;
}

interface CategoryProps {
  topCategories: CategoryType[];
}

const Category: React.FC<CategoryProps> = ({ topCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  const handleCardClick = (cat: CategoryType) => {
    setSelectedCategory(cat);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="categories-grid">
        {topCategories.map((cat) => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => handleCardClick(cat)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={`/icons/${cat.icon}`}
              alt={`${cat.name} icon`}
              className="category-card__icon"
            />
            <h3 className="category-card__title">{cat.name}</h3>
            <p className="category-card__desc">{cat.description}</p>
            <p className="category-card__count">
              {cat.count} logiciels
            </p>
          </div>
        ))}
      </div>

    

    </>
  );
};

export default Category;
