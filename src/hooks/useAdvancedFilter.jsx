import { useState, useMemo } from "react";

// custom hook for managing adavnced filters
function useAdvancedFilter(initialData) {
  // state to manage filter conditions
  const [filters, setFilters] = useState([]);

  // memoized filtering logic using useMmeo
  const filteredData = useMemo(() => {
    // if no filters are applied return all data
    if (filters.length === 0) return initialData;

    // filter the data based on all active filter conditions
    return initialData.filter((item) =>
      // every filter condition must be satisfied
      filters.every((filter) => {
        // get the value of the field we're filtering on
        const fieldValue = item[filter.field];

        // different filtering operations based on operator
        switch (filter.operator) {
          case "equals":
            return fieldValue === filter.value;
          case "notEquals":
            return fieldValue != filter.value;
          case "contains":
            // check if string contains the value (case insensitive)
            return String(fieldValue)
              .toLowerCase()
              .includes(String(filter.value).toLowerCase());
          case "notContains":
            return !String(fieldValue)
              .toLowerCase()
              .includes(String(filter.value).toLowerCase());
          case "greaterThan":
            // Numeric or date comparison
            return fieldValue > filter.value;

          case "lessThan":
            // Numeric or date comparison
            return fieldValue < filter.value;

          case "greaterThanOrEqual":
            // Numeric or date comparison (inclusive)
            return fieldValue >= filter.value;

          case "lessThanOrEqual":
            // Numeric or date comparison (inclusive)
            return fieldValue <= filter.value;

          default:
            // If no matching operator, keep the item
            return true;
        }
      })
    );
  }, [initialData, filters]);

  // method to add a new filter condition
  const addFilter = (newFilter) => {
    // prevent duplicate filters
    const existingFilterIndex = filters.findIndex(
      (f) => f.field === newFilter.field && f.operator === newFilter.operator
    );

    if (existingFilterIndex !== -1) {
      // replace existing filter if it exits
      const updatedFilters = [...filters];
      updatedFilters[existingFilterIndex] = newFilter;
      setFilters(updatedFilters);
    } else {
      // add new filter
      setFilters([...filters, newFilter]);
    }
  };

  //   method to remove a specific filter
  const removeFilter = (filterToRemove) => {
    setFilters((prevFilters) =>
      prevFilters.filter(
        (filter) =>
          filter.field !== filterToRemove.field ||
          filter.operator !== filterToRemove.operator
      )
    );
  };

  //   method to clear all filters
  const clearFilters = () => {
    setFilters([]);
  };

  return {
    filteredData,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
  };
}

export default useAdvancedFilter;
