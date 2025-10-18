import {LatLng} from 'react-native-maps';
import {create} from 'zustand';
import {RegionInfo} from '@/hooks/useSearchLocation';

interface LocationState {
  moveLocation: LatLng | null;
  selectedPlaceFromSearch: RegionInfo | null;
  setMoveLocation: (location: LatLng | null) => void;
  setSelectedPlaceFromSearch: (place: RegionInfo | null) => void;
}

const useLocationStore = create<LocationState>(set => ({
  moveLocation: null,
  selectedPlaceFromSearch: null,
  setMoveLocation: (moveLocation: LatLng | null) => {
    set(state => ({...state, moveLocation}));
  },
  setSelectedPlaceFromSearch: (selectedPlaceFromSearch: RegionInfo | null) => {
    set(state => ({...state, selectedPlaceFromSearch}));
  },
}));

export default useLocationStore;
