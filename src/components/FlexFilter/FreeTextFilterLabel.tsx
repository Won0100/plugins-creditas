type Props = {
    currentValue?: string[];
}

export const FreeTextFilterLabel = ({ currentValue }: Props) => (
    <>
        {currentValue && currentValue.length ? `Containing "${currentValue}"` : 'Any'}
    </>
);