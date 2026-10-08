import React from 'react';
import { Country, ScreenType } from '../types';
import { ConnectedJourney, JourneySubmission } from './ConnectedJourney';
import { ServiceId, Answers } from '../data/cbzJourneys';
import { ClientProfile } from '../context/ClientProfileContext';

export interface CustomerJourneyProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
  onSubmitJourney?: (s: JourneySubmission) => Promise<void> | void;
  startWith?: ServiceId;
  seed?: Answers;
  client?: Partial<ClientProfile> | null;
}

export const CustomerJourney: React.FC<CustomerJourneyProps> = (props) => {
  return <ConnectedJourney {...props} />;
};

export { ConnectedJourney };
export default CustomerJourney;
