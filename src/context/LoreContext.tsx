import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EntityType } from '../types';

export type MobileTab = 'editor' | 'databases' | 'timeline' | 'settings';
export type MobileDbSubTab = 'characters' | 'factions' | 'locations';
export type PcRightPanelMode = 'timeline' | 'entityDetail' | 'databaseCards';

export interface SelectedEntity {
  type: 'character' | 'location' | 'faction';
  id: string;
}

interface LoreContextType {
  mobileTab: MobileTab;
  setMobileTab: (tab: MobileTab) => void;
  mobileDbSubTab: MobileDbSubTab;
  setMobileDbSubTab: (subTab: MobileDbSubTab) => void;
  pcRightPanelMode: PcRightPanelMode;
  setPcRightPanelMode: (mode: PcRightPanelMode) => void;
  selectedEntity: SelectedEntity | null;
  setSelectedEntity: (entity: SelectedEntity | null) => void;
  isMatrixViewOpen: boolean;
  setIsMatrixViewOpen: (open: boolean) => void;

  // Contextual Navigation Actions
  navigateToCharacter: (characterId: string) => void;
  navigateToLocation: (locationId: string) => void;
  navigateToFaction: (factionId: string) => void;
  toggleMatrixView: () => void;
  closeEntityDetail: () => void;
}

const LoreContext = createContext<LoreContextType | undefined>(undefined);

export const LoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');
  const [mobileDbSubTab, setMobileDbSubTab] = useState<MobileDbSubTab>('characters');
  const [pcRightPanelMode, setPcRightPanelMode] = useState<PcRightPanelMode>('timeline');
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [isMatrixViewOpen, setIsMatrixViewOpen] = useState<boolean>(false);

  const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth < 1024;

  const navigateToCharacter = (characterId: string) => {
    setSelectedEntity({ type: 'character', id: characterId });

    if (isMobileViewport()) {
      setMobileTab('databases');
      setMobileDbSubTab('characters');
    } else {
      setPcRightPanelMode('entityDetail');
    }
  };

  const navigateToLocation = (locationId: string) => {
    setSelectedEntity({ type: 'location', id: locationId });

    if (isMobileViewport()) {
      setMobileTab('databases');
      setMobileDbSubTab('locations');
    } else {
      setPcRightPanelMode('entityDetail');
    }
  };

  const navigateToFaction = (factionId: string) => {
    setSelectedEntity({ type: 'faction', id: factionId });

    if (isMobileViewport()) {
      setMobileTab('databases');
      setMobileDbSubTab('factions');
    } else {
      setPcRightPanelMode('entityDetail');
    }
  };

  const toggleMatrixView = () => {
    setIsMatrixViewOpen((prev) => !prev);
  };

  const closeEntityDetail = () => {
    setSelectedEntity(null);
    setPcRightPanelMode('timeline');
  };

  return (
    <LoreContext.Provider
      value={{
        mobileTab,
        setMobileTab,
        mobileDbSubTab,
        setMobileDbSubTab,
        pcRightPanelMode,
        setPcRightPanelMode,
        selectedEntity,
        setSelectedEntity,
        isMatrixViewOpen,
        setIsMatrixViewOpen,
        navigateToCharacter,
        navigateToLocation,
        navigateToFaction,
        toggleMatrixView,
        closeEntityDetail
      }}
    >
      {children}
    </LoreContext.Provider>
  );
};

export function useLoreContext(): LoreContextType {
  const context = useContext(LoreContext);
  if (!context) {
    throw new Error('useLoreContext must be used within a LoreProvider');
  }
  return context;
}
