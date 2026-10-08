import {AccessToken, RoomAgentDispatch, RoomConfiguration} from 'livekit-server-sdk';
import {NextResponse} from 'next/server';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const roomName = searchParams.get('room') || 'sarjy-room-' + Math.random().toString(36).substring(7);
  const participantName = searchParams.get('user') || 'user-' + Math.random().toString(36).substring(7);

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({error: 'Server misconfigured'}, {status: 500});
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    ttl: '10m',
  });

  at.addGrant({roomJoin: true, room: roomName});
  at.roomConfig = new RoomConfiguration({
    agents: [
      new RoomAgentDispatch({
        agentName: 'sarjy-agent',
      }),
    ],
  });

  const token = await at.toJwt();
  return NextResponse.json({token});
}
