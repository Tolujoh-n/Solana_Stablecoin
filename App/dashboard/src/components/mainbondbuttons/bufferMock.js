class BufferMock {
    static from(string, encoding) {
      if (encoding === 'hex') {
        let arr = [];
        for (let i = 0; i < string.length; i += 2)
          arr.push(parseInt(string.substr(i, 2), 16));
        return new Uint8Array(arr);
      } else {
        return new TextEncoder().encode(string);
      }
    }
  
    static toString(buffer, encoding) {
      if (encoding === 'hex') {
        let hex = [];
        for (let i = 0; i < buffer.length; i++)
          hex.push(buffer[i].toString(16).padStart(2, '0'));
        return hex.join('');
      } else {
        return new TextDecoder().decode(buffer);
      }
    }
}
  
export default BufferMock;
  