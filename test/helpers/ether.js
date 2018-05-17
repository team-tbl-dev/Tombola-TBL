export default function ether (n) {
    return new web3.toBigNumber(web3.toWei(n, 'ether'));
}
