import { Container } from './styled'

type Props = {
    status: boolean;
    handleChange: (status: boolean) => void;
    disabled?: boolean;
}

export const CustomSwitch = ({ status, handleChange, disabled }: Props) => {    
    return (
        <Container 
            value={status} 
            checked={status} 
            onClick={() => { if (!disabled) handleChange(!status); }}
            style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
            <div className="thumb"></div>
        </Container>
    )
}