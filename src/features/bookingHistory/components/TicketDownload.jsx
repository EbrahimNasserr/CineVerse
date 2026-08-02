import PropTypes from 'prop-types';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function TicketDownload({ bookingId }) {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        // Placeholder — wire up to a real ticket PDF endpoint.
        // eslint-disable-next-line no-console
        console.log('Download ticket for booking', bookingId);
      }}
    >
      <Download size={14} className="mr-1" />
      Ticket
    </Button>
  );
}

TicketDownload.propTypes = {
  bookingId: PropTypes.string.isRequired,
};
