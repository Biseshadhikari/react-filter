import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/items/');
        const uniqueCategories = Array.from(new Set(response.data.map(item => item.category)));
        const uniqueDestinations = Array.from(new Set(response.data.map(item => item.destination)));

        setCategories(uniqueCategories);
        setDestinations(uniqueDestinations);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const categoryParam = selectedCategories.length > 0 ? `&category=${selectedCategories.join(',')}` : '';
      const destinationParam = selectedDestinations.length > 0 ? `&destination=${selectedDestinations.join(',')}` : '';
      // console.log(categoryParam)
      // console.log(destinationParam)
      try {
        const response = await axios.get(`http://localhost:8000/api/items/?${categoryParam}${destinationParam}`);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchData();
  }, [selectedCategories, selectedDestinations]);

  const handleCategoryChange = (event) => {
    const selectedOptions = event.target.selectedOptions;
    console.log(selectedOptions)
    const selectedValues = Array.from(selectedOptions, option => option.value);
    setSelectedCategories(selectedValues);
  };

  const handleDestinationChange = (event) => {
    const selectedOptions = event.target.selectedOptions;
    const selectedValues = Array.from(selectedOptions, option => option.value);
    setSelectedDestinations(selectedValues);
  };

  return (
    <div>
      <h1>Items</h1>
      <div>
        <label>Category:</label>
        <select multiple onChange={handleCategoryChange}>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Destination:</label>
        <select multiple onChange={handleDestinationChange}>
          {destinations.map(destination => (
            <option key={destination} value={destination}>{destination}</option>
          ))}
        </select>
      </div>
      {items && items.length > 0 ? (
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.name} - Category: {item.category}, Destination: {item.destination}</li>
          ))}
        </ul>
      ) : (
        <p>No items found.</p>
      )}

    </div>
  );
}

export default App;
