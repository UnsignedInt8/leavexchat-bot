
import xml from 'fast-xml-parser';

function replaceMarkdownChars(txt: string) {
    return (txt || '').replace(/\[/g, '').replace(/\]/g, '');
}

export function parseOffical(rawXml: string) {
    try {
        const msg = xml.parse(rawXml);
        const items = msg['msg']['appmsg']['mmreader']['category']['item'] as Array<any>;
        return items.reduce((prev, curr) => {
            let title = replaceMarkdownChars(curr['title']);
            let url = curr['url'];

            return `${prev}[${title}](${url})\n\n`;
        }, '');
    } catch (err) {
        return parseAttach(rawXml);
    }
}

export function parseAttach(rawXml: string) {
    const msg = xml.parse(rawXml);
    const appmsg = msg['msg']['appmsg'];
    const title = replaceMarkdownChars(appmsg['title']);
    const desc = appmsg['des'];
    const url = appmsg['url'];

    return `[${title}](${url})\n${desc}`;
}

function testOffical() {
    const offical = `<msg><br/>    <appmsg appid="" sdkver="0"><br/>        <title><![CDATA[出差别踩这些红线！官方解读来了]]></title><br/>        <des><![CDATA[]]></des><br/>        <action></action><br/>        <type>5</type><br/>        <showtype>1</showtype><br/>        <content><![CDATA[]]></content><br/>        <contentattr>0</contentattr><br/>        <url><![CDATA[http://mp.weixin.qq.com/s?__biz=MjM5NjEyMzYxMg==&mid=2657446986&idx=1&sn=a7aed5cac68e7e64df6fa5776879ad8f&chksm=bd7fcaf98a0843efde9b6a638fe376a9a92b1ca7983635c4c9d8f5b8e74226c90d07f731f7dd&scene=0&xtrack=1#rd]]></url><br/>        <lowurl><![CDATA[]]></lowurl><br/>        <appattach><br/>            <totallen>0</totallen><br/>            <attachid></attachid><br/>            <fileext></fileext><br/>        </appattach><br/>        <extinfo></extinfo><br/>        <mmreader><br/>            <category type="20" count="3"><br/>                <name><![CDATA[经济日报]]></name><br/>                <topnew><br/>                    <cover><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06fECxdzMYKW4xg7IhmttJWXHLeIia0ib0Vb6ic2zTSpK2DuQd2KZDW8K3ow/640?wxtype=jpeg&wxfrom=0]]></cover><br/>                    <width>0</width><br/>                    <height>0</height><br/>                    <digest><![CDATA[]]></digest><br/>                </topnew><br/>                <br/>                <item><br/>                    <itemshowtype>0</itemshowtype><br/>                    <title><![CDATA[出差别踩这些红线！官方解读来了]]></title><br/>                    <url><![CDATA[http://mp.weixin.qq.com/s?__biz=MjM5NjEyMzYxMg==&mid=2657446986&idx=1&sn=a7aed5cac68e7e64df6fa5776879ad8f&chksm=bd7fcaf98a0843efde9b6a638fe376a9a92b1ca7983635c4c9d8f5b8e74226c90d07f731f7dd&scene=0&xtrack=1#rd]]></url><br/>                    <shorturl><![CDATA[]]></shorturl><br/>                    <longurl><![CDATA[]]></longurl><br/>                    <pub_time>1564468739</pub_time><br/>                    <cover><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06fECxdzMYKW4xg7IhmttJWXHLeIia0ib0Vb6ic2zTSpK2DuQd2KZDW8K3ow/640?wxtype=jpeg&wxfrom=0]]></cover><br/>                    <tweetid></tweetid><br/>                    <digest><![CDATA[]]></digest><br/>                    <fileid>509963306</fileid><br/>                    <sources><br/>                        <source><br/>                            <name><![CDATA[经济日报]]></name><br/>                        </source><br/>                    </sources><br/>                    <styles></styles><br/>                    <native_url></native_url><br/>                    <del_flag>0</del_flag><br/>                    <contentattr>0</contentattr><br/>                    <play_length>0</play_length><br/>                    <play_url><![CDATA[]]></play_url><br/>                    <player><![CDATA[]]></player><br/>                    <music_source>0</music_source><br/>                    <pic_num>0</pic_num><br/>                    <vid></vid><br/>                    <author><![CDATA[]]></author><br/>                    <recommendation><![CDATA[]]></recommendation><br/>                    <pic_urls></pic_urls><br/>                    <comment_topic_id>920674350779580416</comment_topic_id><br/>                    <cover_235_1><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06fECxdzMYKW4xg7IhmttJWXHLeIia0ib0Vb6ic2zTSpK2DuQd2KZDW8K3ow/640?wxtype=jpeg&wxfrom=0]]></cover_235_1><br/>                    <cover_1_1><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06fss5mMQLWKS1wIZ8C5PDqLCJ4mDf2OGHTXU0oA10SlUHsBZz7kElmEg/300?wxtype=jpeg&wxfrom=0]]></cover_1_1><br/>                    <appmsg_like_type>2</appmsg_like_type><br/>                    <video_width>0</video_width><br/>                    <video_height>0</video_height><br/>                    <is_pay_subscribe>0</is_pay_subscribe><br/>                </item><br/>                <br/>                <item><br/>                    <itemshowtype>0</itemshowtype><br/>                    <title><![CDATA[8月起，这些新规将影响你我生活→]]></title><br/>                    <url><![CDATA[http://mp.weixin.qq.com/s?__biz=MjM5NjEyMzYxMg==&mid=2657446986&idx=2&sn=4d106a5f707dc40f1fa134514944d988&chksm=bd7fcaf98a0843eff57356d70264e2f6303e4add558cc039f20d9011cef52b6f518883efec17&scene=0&xtrack=1#rd]]></url><br/>                    <shorturl><![CDATA[]]></shorturl><br/>                    <longurl><![CDATA[]]></longurl><br/>                    <pub_time>1564468739</pub_time><br/>                    <cover><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06f3hO5wfxibonNOVicciaDmGwA4Uuvxp2ZyAb3OKmC6NQ2M09cwX7ibRGY9g/300?wxtype=jpeg&wxfrom=0]]></cover><br/>                    <tweetid></tweetid><br/>                    <digest><![CDATA[]]></digest><br/>                    <fileid>509963298</fileid><br/>                    <sources><br/>                        <source><br/>                            <name><![CDATA[经济日报]]></name><br/>                        </source><br/>                    </sources><br/>                    <styles></styles><br/>                    <native_url></native_url><br/>                    <del_flag>0</del_flag><br/>                    <contentattr>0</contentattr><br/>                    <play_length>0</play_length><br/>                    <play_url><![CDATA[]]></play_url><br/>                    <player><![CDATA[]]></player><br/>                    <music_source>0</music_source><br/>                    <pic_num>0</pic_num><br/>                    <vid></vid><br/>                    <author><![CDATA[]]></author><br/>                    <recommendation><![CDATA[]]></recommendation><br/>                    <pic_urls></pic_urls><br/>                    <comment_topic_id>920674351517777922</comment_topic_id><br/>                    <cover_235_1><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06f3hO5wfxibonNOVicciaDmGwA4Uuvxp2ZyAb3OKmC6NQ2M09cwX7ibRGY9g/300?wxtype=jpeg&wxfrom=0]]></cover_235_1><br/>                    <cover_1_1><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06f3hO5wfxibonNOVicciaDmGwA4Uuvxp2ZyAb3OKmC6NQ2M09cwX7ibRGY9g/300?wxtype=jpeg&wxfrom=0]]></cover_1_1><br/>                    <appmsg_like_type>2</appmsg_like_type><br/>                    <video_width>0</video_width><br/>                    <video_height>0</video_height><br/>                    <is_pay_subscribe>0</is_pay_subscribe><br/>                </item><br/>                <br/>                <item><br/>                    <itemshowtype>0</itemshowtype><br/>                    <title><![CDATA[边充电边玩手机，真的会炸吗？是时候科普一下了]]></title><br/>                    <url><![CDATA[http://mp.weixin.qq.com/s?__biz=MjM5NjEyMzYxMg==&mid=2657446986&idx=3&sn=112c2294d8d5e7eb0a904e98b9604103&chksm=bd7fcaf98a0843ef644cb1d98c9badedc897306014052bde7ac81540254eddbfa12c8032f2bd&scene=0&xtrack=1#rd]]></url><br/>                    <shorturl><![CDATA[]]></shorturl><br/>                    <longurl><![CDATA[]]></longurl><br/>                    <pub_time>1564468739</pub_time><br/>                    <cover><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06f05zL7o7Gf0QUWAy5JPFhZom6ccZYw7UybN2K4icQNPcXwcNHLHEiaNEw/300?wxtype=jpeg&wxfrom=0]]></cover><br/>                    <tweetid></tweetid><br/>                    <digest><![CDATA[]]></digest><br/>                    <fileid>509963256</fileid><br/>                    <sources><br/>                        <source><br/>                            <name><![CDATA[经济日报]]></name><br/>                        </source><br/>                    </sources><br/>                    <styles></styles><br/>                    <native_url></native_url><br/>                    <del_flag>0</del_flag><br/>                    <contentattr>0</contentattr><br/>                    <play_length>0</play_length><br/>                    <play_url><![CDATA[]]></play_url><br/>                    <player><![CDATA[]]></player><br/>                    <music_source>0</music_source><br/>                    <pic_num>0</pic_num><br/>                    <vid></vid><br/>                    <author><![CDATA[]]></author><br/>                    <recommendation><![CDATA[]]></recommendation><br/>                    <pic_urls></pic_urls><br/>                    <comment_topic_id>920674352205643776</comment_topic_id><br/>                    <cover_235_1><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06f05zL7o7Gf0QUWAy5JPFhZom6ccZYw7UybN2K4icQNPcXwcNHLHEiaNEw/300?wxtype=jpeg&wxfrom=0]]></cover_235_1><br/>                    <cover_1_1><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06f05zL7o7Gf0QUWAy5JPFhZom6ccZYw7UybN2K4icQNPcXwcNHLHEiaNEw/300?wxtype=jpeg&wxfrom=0]]></cover_1_1><br/>                    <appmsg_like_type>2</appmsg_like_type><br/>                    <video_width>0</video_width><br/>                    <video_height>0</video_height><br/>                    <is_pay_subscribe>0</is_pay_subscribe><br/>                </item><br/>                <br/>            </category><br/>            <publisher><br/>                <username></username><br/>                <nickname><![CDATA[经济日报]]></nickname><br/>            </publisher><br/>            <template_header></template_header><br/>            <template_detail></template_detail><br/>            <forbid_forward>0</forbid_forward><br/>        </mmreader><br/>        <thumburl><![CDATA[https://mmbiz.qpic.cn/mmbiz_jpg/3QdXlNYeWk14JC4gwag92zSISnfnL06fECxdzMYKW4xg7IhmttJWXHLeIia0ib0Vb6ic2zTSpK2DuQd2KZDW8K3ow/640?wxtype=jpeg&wxfrom=0]]></thumburl><br/>    </appmsg><br/>    <fromusername></fromusername><br/>    <appinfo><br/>        <version></version><br/>        <appname><![CDATA[经济日报]]></appname><br/>        <isforceupdate>1</isforceupdate><br/>    </appinfo><br/>    <br/>    <br/>    <br/>    <br/>    <br/>    <br/></msg>`;
    console.log(parseOffical(offical));
}

function testAttach() {
    const att = `<?xml version="1.0"?><br/><msg><br/>	<appmsg appid="" sdkver="0"><br/>		<title>靠印钞支撑的复兴梦，是如何崩掉的？</title><br/>		<des>作死的！</des><br/>		<action /><br/>		<type>5</type><br/>		<showtype>0</showtype><br/>		<soundtype>0</soundtype><br/>		<mediatagname /><br/>		<messageext /><br/>		<messageaction /><br/>		<content /><br/>		<contentattr>0</contentattr><br/>		<url>http://mp.weixin.qq.com/s?__biz=MzAxNzczMTY2Ng==&amp;mid=2648625685&amp;idx=1&amp;sn=1650bc329f928bd5b14d43bbca4cb65b&amp;chksm=83cb6b28b4bce23e7b002f67760f679144c1f822a4ff6f8d7e3eecbe48fdee6d3b2e6fec2984&amp;scene=0&amp;xtrack=1#rd</url><br/>		<lowurl /><br/>		<dataurl /><br/>		<lowdataurl /><br/>		<songalbumurl /><br/>		<songlyric /><br/>		<appattach><br/>			<totallen>0</totallen><br/>			<attachid /><br/>			<emoticonmd5 /><br/>		<fileext /><br/>			<cdnthumbaeskey /><br/>			<aeskey /><br/>		</appattach><br/>		<extinfo /><br/>	<sourceusername></sourceusername><br/>		<sourcedisplayname>财主家的余粮</sourcedisplayname><br/>		<thumburl>https://mmbiz.qpic.cn/mmbiz_jpg/r4Em8wOBKDicia3Chia2gKTHWPBmENdibPVLYG5wLxn5GhiaYj3gQVCWb26GYCSodWAzP9QpCe7f0wnM02lFNMSqcgA/300?wxtype=jpeg&amp;wxfrom=0</thumburl><br/>	<md5 /><br/>		<statextstr /><br/>		<mmreadershare><br/>			<itemshowtype>0</itemshowtype><br/>			<nativepage>0</nativepage><br/>			<pubtime>1564394943</pubtime><br/>			<duration>0</duration><br/>			<width>0</width><br/>			<height>0</height><br/>			<vid /><br/>			<funcflag>0</funcflag><br/>		</mmreadershare><br/>	</appmsg><br/>	<fromusername></fromusername><br/>	<scene>0</scene><br/>	<appinfo><br/>		<version>1</version><br/>		<appname></appname><br/>	</appinfo><br/>	<commenturl></commenturl><br/></msg><br/>`;
    console.log(parseAttach(att));
}