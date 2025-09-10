import * as React from 'react';
import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import { ContactsLogType } from '../../types/dialer/contacts';
import { date } from '../../helpers/date';
import { ProgressCircular } from '../../components/Progress/Circular';

type MainProps = {
  contactsLog: ContactsLogType[];
  loading: boolean;
}

type RowType = {
  contact: ContactsLogType;
}

const Row = ({ contact }: RowType) => {  
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <MUI.TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <MUI.TableCell>
          <MUI.IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <MUIIcon.KeyboardArrowUp /> : <MUIIcon.KeyboardArrowDown />}
          </MUI.IconButton>
        </MUI.TableCell>
        <MUI.TableCell component="th" scope="row">
          {
            date.getOnlyDate(contact.delivered_date)
            + ' ' +
            date.getOnlytime(contact.delivered_date)
          }
        </MUI.TableCell>
        <MUI.TableCell align="right">
          {
            contact.Campaign.Config.type === 'email'
            ? contact.tenant_email
            : contact.tenant_phone ?? contact.Campaign.TenantConfig.TenantNumbers[0].phone_number
          }
        </MUI.TableCell>
        <MUI.TableCell align="right">
          {
            contact.Campaign.Config.type === 'email'
            ? contact.contact_email
            : contact.contact_phone ?? contact.log.phones[0]?.phone_number
          }
        </MUI.TableCell>
        <MUI.TableCell align="right">{contact.Campaign.Config.type}</MUI.TableCell>
        <MUI.TableCell align="right">{contact.status}</MUI.TableCell>
      </MUI.TableRow>
      <MUI.TableRow>
        <MUI.TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <MUI.Collapse in={open} timeout="auto" unmountOnExit>
            <MUI.Box sx={{ margin: 1 }}>
              <MUI.Typography variant="h6" gutterBottom component="div">
                Detalhes
              </MUI.Typography>
              <MUI.Table size="small" aria-label="purchases">
                <MUI.TableHead>
                  <MUI.TableRow>
                    <MUI.TableCell>Campanha ID</MUI.TableCell>
                    <MUI.TableCell>Campanha</MUI.TableCell>
                    <MUI.TableCell align="right">Mailing ID</MUI.TableCell>
                    <MUI.TableCell align="right">Mailing</MUI.TableCell>
                  </MUI.TableRow>
                </MUI.TableHead>
                <MUI.TableBody>                  
                  <MUI.TableRow>
                    <MUI.TableCell component="th" scope="row">
                      {contact.Campaign.id}
                    </MUI.TableCell>
                    <MUI.TableCell>
                      {contact.Campaign.name}
                    </MUI.TableCell>
                    <MUI.TableCell align="right">
                      {contact.Mailing.id}
                    </MUI.TableCell>                    
                    <MUI.TableCell align="right">
                      {contact.Mailing.name}
                    </MUI.TableCell>
                  </MUI.TableRow>                  
                </MUI.TableBody>
              </MUI.Table>
            </MUI.Box>
          </MUI.Collapse>
        </MUI.TableCell>
      </MUI.TableRow>
    </React.Fragment>
  );
}

export const ContactsLog = ({ contactsLog, loading }: MainProps) => {
  if(loading) {
    return <ProgressCircular />
  }

  return (
    <MUI.TableContainer component={MUI.Paper}>
      <MUI.Table aria-label="collapsible table">
        <MUI.TableHead>
          <MUI.TableRow>
            <MUI.TableCell />
            <MUI.TableCell>Data</MUI.TableCell>
            <MUI.TableCell align="right">Número (E)</MUI.TableCell>
            <MUI.TableCell align="right">Número (S)</MUI.TableCell>
            <MUI.TableCell align="right">Canal</MUI.TableCell>
            <MUI.TableCell align="right">Status</MUI.TableCell>
          </MUI.TableRow>
        </MUI.TableHead>
        <MUI.TableBody>
          {contactsLog.map((contact) => (
            <Row contact={contact} key={contact.id} />
          ))}
        </MUI.TableBody>
      </MUI.Table>
    </MUI.TableContainer>
  );
}
