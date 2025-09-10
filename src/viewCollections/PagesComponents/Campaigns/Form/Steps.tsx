import * as MUI from '@mui/material';
import { Dispatch } from 'react';

type Props = {
    activeStep: number;
    setActiveStep: Dispatch<number>;
}

export const Steps = ({ activeStep, setActiveStep }: Props) => {
    return (
        <MUI.Box sx={{ width: '230px' }}>
            <MUI.Stepper activeStep={activeStep} orientation="vertical">                
                <MUI.Step>
                    <MUI.StepLabel>
                        Criar campanha
                    </MUI.StepLabel>
                    <MUI.StepContent>
                        {/* <MUI.Typography>{step.description}</MUI.Typography> */}
                    </MUI.StepContent>
                </MUI.Step>
                <MUI.Step>
                    <MUI.StepLabel>
                        Recorrência
                    </MUI.StepLabel>
                    <MUI.StepContent>
                        {/* <MUI.Typography>{step.description}</MUI.Typography> */}
                    </MUI.StepContent>
                </MUI.Step>
                <MUI.Step>
                    <MUI.StepLabel>
                        Régua
                    </MUI.StepLabel>
                    <MUI.StepContent>
                        {/* <MUI.Typography>{step.description}</MUI.Typography> */}
                    </MUI.StepContent>
                </MUI.Step>
                <MUI.Step>
                    <MUI.StepLabel>
                        Importar .csv
                    </MUI.StepLabel>
                    <MUI.StepContent>
                        {/* <MUI.Typography>{step.description}</MUI.Typography> */}
                    </MUI.StepContent>
                </MUI.Step>
                
            </MUI.Stepper>
            {/* {activeStep === steps.length && (
                <MUI.Paper square elevation={0} sx={{ p: 3 }}>
                <MUI.Typography>All steps completed - you&apos;re finished</MUI.Typography>
                <MUI.Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    Reset
                </MUI.Button>
                </MUI.Paper>
            )} */}
            </MUI.Box>
        )
    
}