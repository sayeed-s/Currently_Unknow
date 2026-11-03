import ChannelVideo from "@/features/channel/components/channelvideo";

export const instant = false;

const page = async ({ params }: { params: Promise<{ chnId: string }> }) => {
  const { chnId } = await params;
  return (
    <div>
      <ChannelVideo channelId={chnId} />
    </div>
  );
};

export default page;
