import React from 'react';
import PropertyCard from '../../components/PropertyCard';
import EmptyState from '../../components/EmptyState';

/**
 * Renders a Grid of Property Cards
 * Reusable layout wrapper for displaying lists of properties
 * @param {Array} properties - List of property objects
 * @param {boolean} loading - Loading state indicator
 */
const AllPropertiesCards = ({ properties = [], loading = false, emptyTitle, emptyMessage }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div className="stat-icon" style={{ animation: 'spin 1s linear infinite', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary-base)', borderRadius: '50%', width: '32px', height: '32px' }}></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState 
        title={emptyTitle || 'No Listings Available'} 
        message={emptyMessage || 'There are no active rental properties to display.'} 
      />
    );
  }

  return (
    <div className="grid-properties">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
};

export default AllPropertiesCards;
export { PropertyCard };
