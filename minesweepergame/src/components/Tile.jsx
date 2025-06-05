

export default function Tile({ isRevealed, value, onClick }) {
  const style = {
    width: '30px',
    height: '30px',
    border: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isRevealed ? '#ddd' : '#aaa',
    cursor: 'pointer',
    boxSizing: 'border-box',
    lineHeight: 'normal',
    fontSize: '18px',
    userSelect: 'none',
  };

  return (
    <div style={style} onClick={onClick}>{isRevealed ? value : '' }</div>
  );
}