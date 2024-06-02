-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2024 at 08:08 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `generalservices`
--

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` bigint(20) NOT NULL,
  `datetime` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` longblob DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `request_type` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `work_type` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Pending',
  `assigned_personnel` varchar(255) DEFAULT NULL,
  `scheduled_date` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `datetime`, `description`, `image`, `location`, `priority`, `request_type`, `username`, `work_type`, `status`, `assigned_personnel`, `scheduled_date`) VALUES
(61, '2024-05-31T01:41', 'asd', NULL, 'NGE', 'Non-Emergency', 'Installation', 'user', 'Electrical', 'Working', 'user3', NULL),
(62, '2024-05-31T01:42', 'testint testing', NULL, 'GLE', 'Non-Emergency', 'Installation', 'user', 'Electrical', 'Pending', NULL, NULL),
(64, '2024-05-31T01:51', 'test', 0x52494646d038000057454250565038580a000000280000005702008f010049434350c8010000000001c86c636d73021000006d6e74725247422058595a2007e2000300140009000e001d616373704d53465400000000736177736374726c0000000000000000000000000000f6d6000100000000d32d68616e649d91003d4080b03d40742c819ea5228e000000000000000000000000000000000000000000000000000000000000000964657363000000f00000005f637072740000010c0000000c7774707400000118000000147258595a0000012c000000146758595a00000140000000146258595a00000154000000147254524300000168000000606754524300000168000000606254524300000168000000606465736300000000000000057552474200000000000000000000000074657874000000004343300058595a20000000000000f35400010000000116c958595a200000000000006fa0000038f20000038f58595a2000000000000062960000b789000018da58595a2000000000000024a000000f850000b6c463757276000000000000002a0000007c00f8019c0275038304c9064e08120a180c620ef411cf14f6186a1c2e204324ac296a2e7e33eb39b33fd646574d3654765c17641d6c8675567e8d882c92369caba78cb2dbbe99cac7d765e477f1f9ffff565038202036000070ea009d012a580290013e6d369748a42322a12357a930800d89656edecab343d64182e1f2c07cbbee2fe779c3726f81ff33f20fb54ee7bb33cc4ba3ffec7dd77cddffabeb37fb9ffb2ffc5ee29fd7ba33f9a0fda2fd9ff748ffadfb3fef47fa9ffa4fc99f90efe71fe57d6b3fe9fb477f63ff75ffffdc83f6a3ffffaf67ee37c407f69ffa7fb95ed71ffff5a765f1c88fddf853e59fe2beee7b37e5ffb4ed46be7df927f9beb33fbaf087f67fe53d047dc3fecf809403fe89fdabfe57ec27b157da7fe4f48bec8ffe3f704fd64ff95ec4ffc5f179fbc7fc4f605fe77fddbfeeffa8f783ff2ff6d3d217d5bffbffd2fc08ff3dfef7fb17edbdec7bf73bffffbb1fee40bbd04b74da55113efffc3878663878357594f293f9c95445ae663d95bf91f3c8d84dc8d83a423c27aab2a8bc202c064b746baaafb6ca89dfa81caa811b307823ed1de9b06b3a3589a5da9755c25cc745c44430f04b4b8034f34dfe3e62d6afc8a85ab706a637c85310c320768e9ac7be8827ae654df28aee06fe95606835ebf038eb16411ae22e32b1d05fa65b779dbdbc8af7e1c64728313efa5d8539ae99d01d91fcd15544acc4039487ec8a0033bfc8b7d6e0cc13aca2013130152e58ae666eaeb6fef16d13d7d8d41944b341e9d5136b83bdb343f3e3686f990a7bd7a2d33f870f4730ee4f9eb816cf8e6a2db94001bd21c07e2c3bbe5c3eed3a8e1c0762452f3da920ef4b68c87b5c26c64c45058a6506448e660a038233fbc8871973b082e1fac0580909239dce826d95a7efa8c810bf0e39ab45c03d011219270f24b92c6513949ef3bc59058119ac6ff77085d8f84cc5d1f5e8f4f80794e14a0544fc0506a1c3f4d1b97d37f5da7961e66c198b595ef46b686b1ffea46b5f945661fec0050054ae1a892e18079d3afef0b810276b1034e1d515eaa23d2d2475465e129def2c08d02316b3b4ba9993bbf91d8aa9ee62848b2ce12131005650d94171d2d799cff875f522573606ea4c9488729fbdf279051275d9f8d9e48666a7e3f765fcf915e185e580b3b5f99dcc1f4ea24d04c1c8bd4b60a96b92944075cb8f204316ce061f77a676b99b773d6bd94446ad2e3010bf0e9407a76db2e547eb9db7586ffcfad58d426862b040af844ff59feefb19b3e0ab9e1ca7de2fa3d5e100af6eec3d548636bbeef07f3695418d6dbeb2e095ab7a99c62374dfa3fe0aca252afff1c1329a7a433b28cf37f9575ae37d0f06e3e77db4a0720bcbf521b6d77d4d4c4bcc42b7afe03ac330783fa6f412ea016600d3fcb4ec53c87b4a05d58d3fde838a269a9a0dc14bf642c1c56417bea178a635f6c9f6454f3650d57eb393fda80bacdee0082acecce20bb777da6be6bd3e49d9f8d1bb5eada68e97c8bce84a5ae9b0c19fee591135c7f39cb23df29f0075bb7d4b5171c02461e96f7da83cd4e232e1679b916755bcf4efa3d889a8deff06e77018a8844847c197a1dee2ab3a7ca146273710b62c01987e3866dfd1816e585b65ca3d184d60384c2b63147abad519923574201678c9e461a80cca704cca2e4004a6e3d568a253eb08cb627b2094cb5919b4bbf16151616b4e7f7d9e53c7e4eb5d6f360469be72884b29b65ed0436ca11d2395aa9a51aea8b2f407c02107dd4c11cd10a72affd9e5c21e0a67f20987cdfc5c261eb919f0cbc7c40e5641d59357b1673c69b84504ad182f26e7f6b85908d383b074dff9cb56589f18e8267c04796248473941e6e03afe59f15f76415ab7f247ad48189d32ea88b2b74bcd45c0693c2e162569abb3e329a69c6b1dd1ba589388c1df168cc74eaab09dfc36ab30a6d3babca5ec9386bce43f95ba3791cd5ba35d51165727a42806fdff32191e403b8682ac82ea0bffc8e4b23f466d92326464ab2afbbe8dc1b31582f1e3b0907ed985623ec30d0398db3d0b0bb56e8d75442179cc536f54b4d33f2e047fce9c4b265798037db0d68541d594482d89320710045b520bc0c18c9a3d7a3e107400dd06b6c14cbc04d3a1d176b227b11c17643d48e347ed4b4e7084cc8f8fba101ed366ba340994a5c16ff439f68f95c8fd40bb55a9e854b6da66c598a6cff3ab331aed341d991cdb2acbd2fa14590f0625dd1533469c1742e13f69266eda5cab23e935777b6882415325227b26c61b5c113a71b869c3c8d6f0ca976b2bca37908de5e8c7095bb7c515b4c0c01894ddcafbb995f36cbd20b7000a9395cea1227bed8752dbf60703d40c17daf819c6370ce1fa43811053e114f0f06cf7799d114b213b79460ea1ccc365c78389e008afcf5f85a60e9f37d0ea1ad162f0702a3e7ceecc9b85ca69e98160d595ba448a424111e38ac28b040d12425eadac5054930fe3ef2cc96d9af624ae369b576dfca8d71e647b302a4858983aee330dfc9471278eaea8a263a3549331f24fa7eff8fd2cad4028f45aa867e79b7820692bada69d7cf93b996d2d12268c184d1489609f6ebecba3ad285b535e3663275e1ed95be7be58ef3c8391b093e37113e9e099ea7fcd6daff0faa717548b7b38ca37d796c33373f0e1a8d0c5b1034f3de934e3237d58fc8f64ccdacb636c9e37493057156e6578f4b00e4c31f3330b29dce3e813e9ab72f24cd942b445d38f3c1a2d39c41bc3bd8f5504c82ab8414c0000fefc787aa9e9ff6561c528ce034e112bf4ebbc60c112552a73991b30c41d397dde27532e0e5513c7830e420f0db2a010bdb753724752eab781b7ae2fb9892bb2e274841e448919d9d883d6a1d7585bc13000cc7cb4442cf2151e726648551c077fe2734b9be1b67ba0ca69cb069b20eb5d4e0383dfcb7ba0b927b7734a2113a818c571d63d528a9ecb77c46296f4df93da2a71a14b04e33260394fa9d22ce1f9596d58ade1df26f5f5cd778738b4cb064bc99c1663e6c69475eece4be3c5f14c62ce2b4e5712072b3fdbc4d8b5cf260007984cdd3af207bd4d4d38dd42a5f0db61ebbcaa6974870856440586e7a850330e91e9c9c04c36cb504ee1f9696e7a8858d4249b8b8b65847ae1b00856cbeabe2872b6633ee0c437e95b0fc193ba72127adb3cd5c695b70af1f434f99f023940fc9bd9c7260848b6f8e6d1b811c5ce8b0ddf66bdbe23c2ea40e32b940f466d26d94391e211b04e2ea3ae96256a43fb353344c1b2cd919a4b85b830166a65a91598717d8cf30f492f6514a2d17a2a56e7d641a4926130421d95f08de7f83f1af3b57a04860cd1bd4f76628e1b1187fd2d764db2aac215a79bba64c24c98e2e1146cc5c0b3f0906b1e00b66910cc1809912c6256c58e62a493d5f4ab8a55f6c2b1073b99163a2024981f3e6fc26f909389bad2c1c799d57ada704241c930bb89ff919ff12cf447b9182c808418a5aa5ac7e113ee2bccbe505059ae058e89eeb87cd464f94679b10ab2fa63ff9d4ed50adae2780495529fe6bf5b8669a4b687e1e527cb4048b3e68de400d6a06a4bb43e1d5caef70b9468a46e4fe999f7e388060c254a2a753038fa37bc998f641aa73e9d2ea6a82e70aad493c5313f4fbc4aaef199ab2eb2217de38af792d397658066209b8c81cef367fe61cb339e99102172f1b75440fcf3777880925403b045c3293818f3861af6e9aa62c091a38f3c8826b93dcbb60f8c6fd3823a7d1f2d3c2ba51a7e10f3fd81e3a452775e2e96519d3e98cd57a11a08f1edabb6593db4762e712720368a1fdcda0bf477fed74090d6185677b335a1d3ee62b655549966c1323607aa3ee06a232da3cc5d7ee2b48db33b3b50fae78da29636f14306c327b00c54c3adbba9619dab9de0aa02836297eb241123ba922a7a8e4c575d545db6ead5017954a54952b05aebc888cbbc1b249e7e2b5ce582794af07de078f55205b49c8365a589583cf195536957417251a67c679e623ff40e714a7e52a694fde2ec6f3989b9985cda8be16b672d1281e598e352860721d72d7f682964bb7cdcbde19b3ab0d720d9b8d28f92123f28c907786059435095fb9c39801bc8467543d05650b48420d3f4ab3515af681a40427edc6b2e321e4e575c80ca516956d1c792efdc2305a841b8279ac635b3b542b990b86bb2026df77ab399c49240fc516dc7b1ae8ffb2ff5e0cf784811f8427e47a2ab54c3149ac20e65b473d39b0474583d195407f8368cec99aba5146c07ad3aff751f5455bb017f7060c18f3eb3a793ee5b3a2856f87dd5bdfb073eef29fb20ed85f5b9975f0482733a06c7f9a34d0c48eef251fb57b5f57e72a2c6c40db30dbb65bf45577d8dfc494d45bc02cd3a940adae066a97ef067d5bb2776fe25bcad541497a62331bdea58485410d65684e126f2c7bfe57745e424bc6d2fdb1c19140e5c3c6e3d97a07189b319fcdfef7bd2b831c2993bc6fc320eb35f6879ffb9e4361ac588779f6a9cd53f40d6d7f25202d8681769ac93f59f2f9c5ae3385159f8aa7640b6cded29661cb50d62692134b95e6edcb929d4398d06d740d9813cc8e4609751e9706e19f72fbeb91a27a3851f6c8f73d5a5fc2dbfb0d279b6194537b3928c0f15aad69c5cdebfe7d243dcb8edcd6db26f32b25ba9f54086e2de85d369c37b216d5ac0e5ac339ef5d77606713934fb705c822ddfd4ac322eba617cdafe2d782ac9da02b3c98bec31d7dd0811c12476a8bfeaedf32a8075baaee727dfcf4233a303829c6094117ee17ccc74fc39dda434157de9693a5a7e248edc081ff9feabe33373c8eb410123e55812fff3cf49cf51b21413ec3372a2e5ae5066c529afee2cb237ca782578de550219052fef1512a4232ad1e180fbe89942130f28f5b3de9c85b25a141c67afb90a0b12fb04e141411fd85bccfacbcfb418205387dfceeebf97c0f903eb99c0dc4dee0b39112fdc7fa9a3803acc323e32cee3810d34e71bec1e2c37d9110aeb28eed1c4bc5ac54586881835949b0f3e0d3717ac67ed43bec182cdb99f0e17c27dbda1e0818cf4a700404996d0c4522463e8d98d6ddcb19bf47330423057630e9119c3a35923092fb89a903a7138f4b26b68ffde57454d35ec876c2d987732803700c263d2b683add9de225f62c661c5918831d2ea402d0b74f35df0569f1b658f32a279dbeed7c9f43113140b4a89b5cba851fa0b3172f2e519d562e41fae08baec6deee29b3e065d4559ebdc65e52b91cf107543347fb487b192fc134d5576b9fbbc431734d989dde5aad15e08a1711771df287fc12cfc85997b27bcef0c5ec56d6825f197b1b609823d4d53ef2f48d996f88ff98bf41cfa82d47f7c8a5852211ae2da44c51406e9caaf3c7a284543b8f91f58a2bb2b5103f995d5342957ca41607efcad1baf2e599fe300818f69d0131457826fce8b7023de3b7ae7cca9ba333578ba91b258a9e5f1c499c129c0de89bea6bb14c6104f4756213cfcf4612f5baa4d7978103cb287d664ba8476449f366d6ffcf5d9dc76b8e139f047167f7744ade3671c080b6f52f0beadf3038a53d61208e309336625c78dc96d79eb3bbb04c01d763c77d47406ca4b1c99e96bd0b818ec683a2870ae82e6a7010f25540b511c93f506a33a73ba769d8962d543caa2429e8dd35515d1324e2bac5c7c2ed4b79a09d0d1b6c66dbfc86f038205bff43af2a51d5f3fea711e2342d093836b3311400a3d27bb1dd59c8ef33facc017a605cbe8830d37a841498cdc7b83927a0b7eee4f7ec3373a787ce2bdec44c6db04ae9d5c74227aac13eb590173e86bf8234869a89d970e4a34f45e925b92fb2987f9657bc477bfdce52714df038326e101947609840331cb7fa7f9cdd62483f086c2f2f508e19a28865fd56deaf910ddcd604c8488a4ab8908c3e75b28c299d975efdd6a01ab67d23c67fc737393132c3a21145f90cb5f02ed844e29025adc37edc70de614780ef772e8cb380158c86e4112d6cd96f4a9eaf5cf7d94a5583c12aa5565c781c2b61043f191c8a62ff386ff928fc6f3527fecf65ca208ffb38f0a2e54ef03faef0e984707277d34ec33b1c3c2fceb7586d8c6164e9b90eb1633dea3a5256eae4b6e3f5c6faa23e03ffec416ff8a3864b8465a4be8ebfd3a5423c952472593e255bdbbbf81b6a7ce8b5d37284ff37dc16a75be296d32ea4efa95556defe6fc0d93f06eea9cbb45f214cf36a0786fcf92f4c691f0211d62c451621bad8475486ea66ef6b8b519b744d2a11b141f18746060c94567435003306d6c2ab14e257625c5b243dfdde53fcf02b4302cff8d36f5bc1ea1d8ee2e01dc8e455cd0939dea05b98cff62ea0ced401b503a731e047cec4ced320ff34448895cb093621d31fd24f1f1d63642fb97f19a94adc989bda8043b504bcdee9855aca38bc968fadbe1e1fb7ddc3da4fe2a97f423ab11c74fa98f794c1c3a1ea73213f3a1443b766ecd2808c4e3027cc377916dab665654cf54a7b4b93bdf3372ebef160f049fbe39fe479fcdebd29eb50374bfd9bae8360cc25796ba2ffda8baf71214fa9012354745bc9b43b7c29d98e91b67f1f4b26de2023780b131d57d82bcbdd46dbe733d7ef2cd8ddbe66e544b4a40a37c5206bcc8ac95dc4fc2ce38148d3b67d218cf322c9d36131bd96b32093698f2566c5bdb66fc7cc0fbe0a3d0b86928fe346c36664bbeece5c080a93d4317949822ac8bb315539501b1db5329377d6441071ce3dddff921a30b3714f3b49fc5fac3c9204087a4ec4ad6605ce065d255032a2a4d715bde139d05425713a789a84dab763c564934061f0afb9814a13672d7c51f8df0c77d5ef43ad1d6a7d4ff8e4aa62c9d4ade01646dc890e1ba8cc749cb8009712262d237723a4a92006ba4f38e992cfb0df4e8d462da6275d22d1018ee3eab64194e93e850db74325fcb5bae74ae8133bfed1e25dfa76470756a74b4a7233130b5a627286533d073264efd31098eb4745159b2827cc7c5f735eb570764156446c17bef28546be3f8aa6dbecc620b5553cf2033abe3da36bbbb0cc4d3e905700f471e96e11f7535252395f0ca98525dffd582ea2b0a90588b565e538449d0f496b6a5a7d23336a024188402288cd8b386cb746549e5784c36ac6504381b76a328164335284fdf707fe388b3bcf3e163da50e161d29618fed0448517dfe301ffa864263a598e346977abf505f8e4a713e6c59b37c91269e6b59c8d029b1ece70a1ac037cbe079c0ecd01e90248b52beda245f82362dafc2b4a697306889082e21156ee87a985fa3ceaa07a05b459a5059c1a161171045c8b9bb3d188004fa72e8c139119081f1ce0f29afb7596e819c7ace6cebf47b3f4d3875632178437c0781efc717ddebe0f7d85597fcd74d49069a31747617d95509186d039c819ca18053f55a5fda42a953a98ccc57b8d8460bee4d2fb3de218ef66c15fb5ff202ede89c3cc31f0636baf8f67aa33574405eefadeaeff994d8aa8bc9e39c09d3bbc05f391e67994f582b928c5a6bd4271f836256b9b938e85fafc4838116370297ffbfc375b5277d67f7bca215dc2a8341b6a7df15985fdb9bfb955fcfdf8468ad9ac233fc5a729d78d1d415f82029a9762eb2329ca22d06034582788c82f4dadf6ddf1d6aa856b6bfa2b033c17b156225f49f9eb68a362770bae3bc93724b9ea929a275e8a8ca64513327e28a24fe72faeca6d7690ad4011f45dce94843a4dbd1f1bb7e548f7c02d4cf428245b0739959697b46e97409be0d58da8a2ae937eec454d201aab0284dfe1924084b924dfa5ddb550a83170673f3fbee8550234af17db3a1317164b42a42b46d953dd208f5c83e8046e6e574778f71d38c63ece3265cfc9f5ffa96bde042e73bc71ce681a96d75c6d3809839bcc9db5258f13656f72e3eb37962dca99b0df52cd382ec1d64abe7e199f06b87680f55cc762c8b894ab6d708ea8eb7ec47d698b4eb471da06ab8241a724e24955fb26f9902d892d33c57898e17536a0a81439ac1bf7c5d1e1a4c2c2cc11dc1273b8d0088230a1852c1f16cfa9cab599167d2611781782e8aac7cdc4b9b3165d24429af8a4018b800fdbfdd7d8d9aae0f969dcceca6757639b0e945830b77ba1560419f8db37a97153345d618d4b7d6176b80ec2a8bdd2883b0070b3b8c8961497fbcd1600046c0e4de23649ec2ae819b08150b026f799353e21dfcb07e519381add9547b7c3425f4dc21e38dde97c633e8f47d27b3608d8fef8472eeae296d5dfdbdfd813e799ce24bec846c5646dfb3bb273115b1ec8608050fe39315b175d08bd8dd027a8ad9b574cef13abd0ec39e08f239d393f4a8f7563c58c0377f1f83d2242e24990a858767796220b7dd40ddddca60cb0faa88dd5091d623bd5b6848cea11a75be6e18e96cdb7477f531a2388488dc9f7e4da41b82194fa39c994ffea5d706e2f3a41fd4ca716ce1b048305d04a65e7274b82bf53f96911a4fcc314463929af461141b5eb745ce5151e38644143e77f4628a4c4360c0dc45de37ce5fa388687b6efc1450c8667016a221d4fa8ffd59cebcaf192ffa1c2d2301419f4f05ea10dd8956e109e8ac4b532de7e0458351c1b1414a943764c326538d5a6ca43f0757891c76bebcea5df8cced53e7648f672804d83452732dee2c91284551d06f2bd9df2461b32006e5ae498d4ffdc92804cac1a0857992e514cdea763ff3cd5e4f986eef8a42d2ea880296729aaa59aaad52fff0961ee15b5d50590b950d0b1996ca086c1d2807397b0b3469025e59998f16f28e09a3d82f884d1178a523e01f4f5bbb2bb85995902b0e67b16c635d8b85c21d98f931351e9ecc6f66f8a4108397aeb2473538fa2067ec255a60626b9ae7d18e006a67f963e5d5ea06ef50f30c4716c659171d16edf857198f0ede571370b7c6ee458431295c418c7f593b6749973e2ab57724387bc28a8ec72ef80522327855aca26e4d5de58e92f25c3e66c49cba0d91a28d9360cf1a5b2af0f096c125bd4c602afbb6e75e0736c364ae830b4c41419b3cda8a9b3a0e5f9da9eeefbb5b86d4ee88d7567d8c06fe26595c8a2b00d93dee7c9a356e06845deecdbedb7fd09d10ee2d62f7ba1221fc4b0796a8208f0912a4679f1ecc50452b05824d54d1b7dda2aad9b30fb139a95e20882595d5ba8f738611460598c432daa98fc260b8668511ba0590a5880dc1bc3f422bb252c2d02de633b1992c8bac67eda7aad587b22545d9be7b9f0d571aac36b04f1dc257d1602ce64db756c2582c0b0032d9a32e685fa28d689e30768751387e98719926dcc11b10b118b242134b56422b97d69b2c17eec65bfb2001ae104141b8ae05181478175083892601ea5784e4c8bece1399fac292097211a51caade267b6fb837955199fef639a2e3ed5a2d2b7cf7d0e2da54fc121176b28d697e5c8b06a922109cb38aa889eed0c6228cd0d0a4c4b33fd654a6c4c0e8965531262e6566ce71a7a45884b7e08ef0ece75cc115f7349848cf00b62ded7ffd15e2c69b00e19b633cdf042a8f0a75948a3fda45ef540065ed7f8d585bbd20a2f9a537b623dd8b0978f82022685cc6e97e40e4f1249fd740c674b187955db940abc0d7c2f0cff431ea3267ae90bd4219561a2afaf6cb5c853dc0e1e2f9d251db25bcac6f1b59a8a2482cbc79f4d784f180174bcff90ad1f49d2306b329d4f559f3903f16aab798bd297bbc33e2f620609bb6b6e7c4da2855402e376e9c40432cd25d2720059bf1e4e9724b52066c279ea1376fa6dba948e396518de073834ac8fc565213f33925ceb8c443d24e8e6c992659ca78a18ba543d43ae310aa963b505b0e62e3be9bdad4192920db88172fc9c65b14121a1ed10ae4a6dc08969c851f654e6425f8e527b88bb703232eafe741b087648e7c1b846bcbe0a78e86ef8ece6b6cc5ca6e597cb7ec06a7ccdae362b96bffe2de0c243a55d1801d5bb9ea2f0942312c2a39ffa87cec91a44ebf89b41d9115e13ed8638c545e8e4a93660dacc101d3032fff4046156ba11ffdefb195d82fc2ec0553ebcf41b976a5eef82f7c70b19a73071be0746b4cfa938935069d7ec60a7ba4ca7605e9ef5ae913e55c277d4587e78ee0e2d800d28364510ff566a3d58446402003b2535ae1ccbe37c3703ff41beea144f6b525b6edd0de94385116f11b1a210492df7d0bd665245078e494c11b90ae927432b61aa01de376be6788ff7dcf6293f52ad979ced202630912a26b88c70d4b62a979be2ed47cca08d0044389b286bf4e1f16b1baeafabe2a8ffe7fa058558f65dee85e4d26c81151f3eaee5953df007fe306d9e0989553631cb53618090048e706acb0c7bce1841d4d3af94efd44bed937329e03f64ba2a75527e74f1007c0eefdd609bb9151b061b10b3bc9d64a97ea42b7aad6ebc9e98d74f1933cd3e00a45009e9df2ff6bf85d6eb90185f7c4739fc20e89fbbede9ee048eec6de6b83160c328f381e79fbda0c2cbe904874cc21202cd0b2b2c9aa43eb4beb5c0f5c250d7ed79a62a7350d1decf600dd8178847a200ceefb23b9ae9069b240b6200c21b0b2bbd86d22e0c7ed53bd3af1dcf7bbd895d639895e1a95e638f7f1d7540a8d782c721eead837d5112ed7b23f19abf39df40b088e0ba63e8bb5a3d6050a95aa3c7a73308f329f324686eee60b920b8b163b3a3f1af2e2f8a085bae2db25376080a2fc83be5fd1cd36e80199b98162571e0b908c01276cf0ccd3ebaf2aec294f0c3863b9e5e40bb4e407c8406450f9b31896c47781fe4ef3c9c621ee1eddfa5eafb4c9bd9d102ce3e748379ee22cb1bb9de58bf21107a50c2d59734d7df1dce6cba3bbb4a9fcfcb2f8160b6fd48fba00635d4d29549988a713b1982cfaee5199775681afa63c4aa33a33b3cd54b5a88ec2568f3a48b9d64da47361f8f33cc8280d6e37d783c70cce04ae2796ba765d8615969ce5d3c81a840f8074111fd4215efb3b31480cbaa977bb0620a888073ae6aa133bb4ead2c24ca5a693264ad505f2d91656c957111a16e800acc734cd2b2f291b888126a8851482965b06d618a9a801f484db7e6680ef4aaab881b81ba294cf279b5e0ae4e03027ee335a92efb0c90560eb5e755f10466ade3aa483e8dcd29352e8d3d94fa25539a8a31c94f5e5e7e01f250b1026783dfed1f177bc3fe2ec7f33f71610c55449ef6e6d69e02e82486bd2317b282684ba8fade12822fb226f60d0dec499434cabb105ddedf68eaaeffbb4715b0a23bb6adf557af99f97f1ab8edf2a2624ca492beb4b7ea32f5c6db550dd74da9611d5d776cd715014db141ade628cd7a45220c4357165ccd68ed87eae65c2dda8df66004482b1c3091241583a9f6f8716c0d60ef3d5c667fa8647fb8964a5ff4ae87cb4287f78e8d393751eeeb5b0b4787f3b90a7421922ae769fe244bcecc7b09ae03d5e7a288eeb56263cdadeba8a53506881f7a409fa70918cfed88dbae2ab111480dce09f38f9b4337db16292b95568341572574657c3dbda09348db7673d98ae434cb157eb8e0f4de05451ff6d5f7b477411dcbd1c61f26d5b19c596926638f030e88d97b61f814fcc9843d83998508c09d07f6117b1f0ca3678a29b6d0c8744ccebae2c104465f04a3bb63391eef27aa59e5325fa5b34aad7ee59cb0927d84f1ca9aa1d687400f397d5456c650bcf6920ed75c1c85f5e6275bffcd649228596ea693e7d6adcfb839cb82d1b24c60036bc63a7d593c3d1863cba8b5e590a1ab44fe2df92be378e4cbdc7bd89e85a1488006cec99c482b8f2978d7ccf5bd040d982bbdf233ea12e3db94df9ce7fafc23bb33f2e196312fd3966042fea0b6831e1a810bdd2976ca6cb2fad6900884bac23c5468aa3ab1edfff43f4274ed4bcbd13de93f09ce1d6a8568d57f72184177d608a1de5bbcddf7b229a04ae8cc76bb10ad693be1b6c593daf32a7b503ae9599407d25432debcfeb3a68528c80b5878c0cc698ff6d55de6195f4f1e673b6ce9840675702d817ec6fea3fb0b7603ffe5bbd833a9ca1adad2890f0271509fcbac604dc975f8642753e33840318c06c7703daff4d9c6d6666cfa93cc7af639c13e2f396bf3eaa281785d487c7d9c5aada5d2dbbf9fbad9efdadb86ff8cf77915293d7af8255a64af85f1280dbb7a8e986776734727082bf8326633a6f9527a1484be40c30539f2729a0996331ebe704ef68b3be927674a553295b0e2785cc2d10582303269fcd92cfe209e71393a2cbf4a0e281d622dbc6477f66ff15e2d0c5ec3ce627db45392716f1b3c04750de2dffdd1bbf3c813111e78d59f3f3c6f57d81f60bb34d7f161dabeb55e3f9a2604819f251134a47527817f1750f2dbe0848f4102aeecab939dd9929daa27f09d426bda90a96f9f6ee89a83a44fd1f7d60b56cc0d26f53fd65a8fc97f82552d841da1e4f8fd6cf942d6e35aef8243b084d3d4a18be7bb00d2dadb04476af85e29e86ce9c4087bb5bbba00ad4e2054ac00c704d3ed0dab3e483648aef1b05182f1deea2f14f94f806096e5e0d8073606ee5c7e30f353d684c0002362957c034167b641018201b33d9ce7bc9c9240c1677202ecdb73f14e8c136fe0be61f7bfa2c31ec0197654f091148224b077a27fd1a073cf3f180db3ba208363b808f9461449f16b1081b24b1e0242fa5c19000003790da4308fbafb64afe2ffb5370314d628fab4cf99a6bcac4fe0dc7ac1ad26f5dd5686c23405b4a593e7aa046ebefc82de84bf8c774b9b7b266520e82e9096fef53c1e95fca494f8461440aa83a008fb53976ca8011e6d70ccd8e9fd67331a5c57b6b7c4c34b488d8123f36422ff73aea209a23ac403d31dd39a3acaf8ed359e00cf6ca02bdfb79ee95aa08d37aee3fae8d9f3f4b74d150b9ed6e7def918afad2ef89676583caf34e57d29bf29b848fd5251974722f9f03bf4201f765bec81001c9bfd167a08be1cefd4af4787330612a917c9e3eba4262557503b8bf0f2426f5d59aa1a14c5697c1ea40edb7c9b2c8b58caf4ad3319aa7357d542df880351b55cbefc0ad8cd02e68bb31dc0efe6c836571a8f084585d06ac0066bfd8fd120ef34f0f859cee4e9252afa83813a5876b05d23d34e0c9fa2a5b1d8fabc44480da743b938b68f9eb37e9b8a4732399af180034a223dd78f1f5c9e1814b189cafe2816f4bf3226108764dfae46ca309d00cf1c4c6c7fcc2c5866a954277f993b209502fee5eca87b8c633f418aba3a42523c2787aa0c8bfc9d571ea563c33fe6e2caa592f86f0081fa86ee1e03aa2dbe6faadc56cdd979fab9a58eb9e268710f8b592bb89ddb91b985f680f8c46f5b6fe7926920239b98e77fdf9fb296729355057d6b656b0a43746e96d3208ef05784322fdff82d74015643649b2bd5c323ba5be962d77a809db10c0c35255d50d11de9e0c0fabcd47858307ae3da37a37efc299174f90b4ab1d090a92014e79b23c8edd453fcd73b7aeeeb4c00e01d8d36f14ee6a7bc20f73a63e3d82c6bf559ab3d3344aed69b42ad987a52e03f60b551d80826cb7c286062d9a26c75e35287925dcf84cf9212866ad7c724fd86a5c415c5000184937b19307465bda3f69cb2da5bf496459c7aa368d26c54a8dd5ee53fd14e8db11cbb1f1529abb9d0ba74092d635a1426e7c58b1d1e91af137653f553499e1f2f924350e3f1e255217f5ab3f3bc09cea812e7d2d3d6a5ab51e668297ef2ff0dbfca2ee0aecb0dfb6ae3fe861040b46fc60dd96e90b68bc9a1a36fddd24204a59f53c811544cf1424122209b57d073bda45e80df8422732403cab2e3e77b64832f7e47e045ca48533a325d79eae42cad36c0fae6c46ca3144c001e63ebf959ee0559180a4886f8388143a2dd54f6ddde0b9ee32ac68953b143a05a52c00ffd5cd8bef521f27cd7ced5cb66ace7c087655177925a2ca420df06d519f3bb159944dbf9780a057c35095ffea5390953ba0263f1b4cfca3d3b8479a2ae1e30344f1e5c8ff64cf6ae08cb16e283b9946e7951503d673ad03820f6bd22d8e91e654d5de6fbc55783468b1d7c8ab724b07fe0372da00a901323ec4df6a6e733cbc41cf78675ba4ef387582f62a34b31a2a6b54187ebc0d8544ddc5fffcbbdcc5578966e1feeb80a8e89f8e134106ff5042440f2fb77efdd3c5388fa7484e5f8065333be24c63cf6e88db6f5df9ad5a5763ce1609f8576ce94c3ca88da5138f01ec35cf22be9134222f3a7c7880eb3670acd45fef27aa798a9b0633b492d10c3dba50ff304559c4a98fea019d7165924265002c158360d6b0e6b8034350b428fc0ebe383fad9e39924a0dbb4cdb77c36f15d60d1756cb5d7f720004ee5bf52f3b05df682db790eba42f17bd068ab55b91350d2dc274da1e16465a3e676d1a8f392fdae9988d20a3ded3891fdd3587589eb2048a85f0fe4b6643ab6fb9859d50485ab59f0b21f7847c900c9ed92a4a5243119cd3364ec2287c5ec9a1b2bf981c27c92b0abaf0e19686d2463f099f40b23479bdef6cf042496792bdcf5781506c2a155fc8df758908c61153482672158a80b8b7038701dea0490760a01f261cc2e4f86f1ffaaa4e30c9506c89490d46bea45943a4a7a029904ee02647295dcf4e3b4236207b99a30d2d44eac6c6d2e505dbf6f29c0f8f55d115f08527a066dea1cc40908108a4fb3ddd69d2167764733cc67403fd5a1b1e2c057b19d171658fd1d1c64a2d59f323ed164dad313ba209cb6c926dbdc004ad89d44248943b54b0f7085e5c03a0062279d57783b004dbadb847ea96ea3bb9fc5bc779c852ce014bd70bcecbaf4759f11933fcec14ca7cc0be70b0671b63f35f91ffd4fb2021c5e9ed5b44e0a105ae298b41dc75aed5ada8f8e4c578f4dadd8b406eb5acfc00993ecdafe19f39f740326aa7dd4e7a05f13d100fed8ea1cbcecde05da383898dca9abef8c978c517f16d53ff97dc59de027445086085b77968b58fb641827b43f32bf84caf4586bc0d19c0081d94a4115f28332c1b389b79414bb5b9c399cd9e712711bcd4463c91771a0310ba0a3dd07e4aad97542c0a2531b7a483d2d5511ea0620e5850386a0e51bd7cd10502dff9dc04e9a8892ddfcc709f8275df203aff5cc0600c8a6bf09b672a666337b4e4c21f489c5cd799823dfce2ece75052533049096743c1dbbaf57f64d17431cbd737488df02dc43f72cf4d1016298982a0cc0cf48eb59493bf73634e13e2ea1974ebc5643eb9ba71c3472932a077c5a2455ec47ce55b46d9d0e211d806a1a7266fab96c3b73a1df933ff0f14c67d6a5dc0388643d8cb14fb101fcff6eded958008da174bcc911bd4d959f790d0dc4a158eeb3350a3e4b5c6532f317a7c09e7bfa9f3b9508764fe75b9bc4520400b33d216f732097d518b7686225e2bca184ad48ac2d17d1de58163808bbc2b8510556e76d337e01f1104ec052ff1bd230faf36f17aa2fc95b6c87961487b952f53fb563dc2f862a34047588447a2af1e90a25fcc4c3c25b7225bf4d78db743560569d4ce5bb47856a91e34ebda2f9b8be10864a9c2ad423896bf45b84f3300f5fa9ad8531011be31b8cfa77c6e04ba43ef203bccdc426b504e808efe174dd2380fce66633e70c4d54c2577ec29d42a10a0b5522e240d03d63f7d8c12cf221ab11f5722404cd9a35acc489a31ce3b88a97e0d4563d2ac15a2d9c7be50b8464096ef30e0dc3f2a498036bed037974c7d8a5538728129fc4a5d79fdfc5315c72d75622be8ae66a2a113c311d5913b23570a61304932b9f7dbaecddf55144f9c75f4f4c58aa1135632363bcdf36d986b17bb83e6da42ffc5516f410cfc54e7284b6c0038d07f59dc32e194b17001dfabcbff14dff10e0b386296c4deea3a1e828c512784ce9fb8f2eff8bf8fcd7cc08bb412fffb14f7f6080be4e16feb2f18ff4b8f80b50cf0afcdb2c92ef0561756e22e0ac123c8a7f0361bbe2751194303ca38be8d1cfb8f8aa56ea803428379e04613e675d9535bdcf850b1d2adf6f0c99495e7da1f2a44444b9826033d328b9d1507570ca228a34de7a46210aa6ca923f5b590f87fec623fd5c6818135b57879a715196daa3860368092c3e3c0fe93c6e8c79e8355bd160a05ea7ec9f30c6a42ec2a038d26ff44bb6ce194187b38a292671ca5e39d66e8abd8e21506c78a7e9a4fe4ff0e659b6ba079defe9dbf8bc937702575fc27c8620d7b9b183120f68d06c9d5b5db7e65dd29c2498013e0e337f7a5dc37293f7af72930179c28c295bd8575d36c8d22197336ef221694c5c73972ddaf6d2e3356cde871648c253258089f23bcf32d93605b9b1b28e70187868c91fdec5c650605dbeec46d511663ca8da607974491497dbb103ee65ce039a7f3f8638368899d421355fcb486f86bc9192d117bcb905e340089a6bbeddf99922e2d2994bcf1c391efdf20527eba8f570605b1a3a4cc4eb12180db0de1521caa0af22384f143f272376e9b13932f9f20992899afa90ed5ce7e032c32f75ca75aaa4b7d5dde9889a0bb8a7092c09afbb15067519b71da2912394f64b71250b28d33c93759a8e9c3b3c7ac03d25f84d2a68330b6d864afec1fc9efc0d2d57ee1c8c74e4aff080d6a618981ae041137baf0c4e7ec5f41095897b7e0adcc767b9d640c789df9f8a8dcc5687cdde61e9be8f97c3121b293c67d23758d45c60d295f0695607b03687a059a9bc7dcfa3992c5c02740913e3633702a5b75051c1193fc80a478905c5f1c80c2b97000097394557795035d47e8b6842c68788d7cc8fde8fab6216472cfe94d355c6b7f2af756099fd30abf62679ab8369714b5dc62940aeb88ab4de6f3a33dbe47a2977133377118a51811085159161b2c2964e24909607477a47bb9e094f639d7920c2f5fe2e92b438f389416a14b5d4a99399e6f65c33577fc2aeaafa5fc7580dca43b19a1e7cd01f1e704945e63cbed05769d6bd13540a2323f1765ebfddf4962d07d622ce64195e1017a1bcb4e5cc07632755e813435897a17e91f966dfaea4d5ad5b3ce7acf52c129463abce942051f4fbc0e6a5586f905e5403fb6bd379f2042565a759ed082196681daedc3580deb24dfbb0942e94d5cd6d9e0560b005b9f1f4c4ab00e5187aefa613142d1e6cab9981092ccb3d22fc1c6fa0a65a34c1853aa2c5cabfe854df45d7a447a44cfed3d27fdfba920d041246ba7d3fda1ee9f2bc02fc9439618bd518f12fd7fc04b4c9c91958b0bae87173190d86351cada0ae89a07f6bb0882908aa9ff146b6736e2819ede73e4897737eb9f14fca6c89f975ca1fa113653caba92c7d0c80b179aa9391078a4823f422662788cca465383fd6da1ba0968fb76469bd76c1fa528f4b7176da57c6f6e4b18885d8b1de8c2e93a38a4917b283e4484fb4f7fdcde00e1bcc543dd67699d9af25dcf3b44f8647a7462e4869511daeca767806bc9079549b4053a9449f985d1981a294b0aa92eba05f8fa4d0bd32d0a86e03cef1eaeb3bd3e490c89bfb75d97dcfa0ccf211836a4df1a1d95bb3f5e75c9a8221155b579143dcfab230373ff9c20c0d6070c20728c5a3ca192afe53ea4041897a24e12e169f255cf9476834fb584b45f21c22297b13610f0f889a8a38eccff43c9ae264b43098c2bc95c06bd76464d54d18ad08a0b6483eb120e57b85b8ab5ac2c053f8cc24f837782354c012aedded58e77be6f41cc3b3b7fa35faf228d2a299a2d2b6e0946ea07d8a52a139bc5567b03e18564805928272b57542daf22ca93292266fdc1f9df71fae54cc0108eb5aa75e6c5211f88882755a8eb3a4748df8ae74e1d599d203be71398ba7db2bad97a18a859fc924c2a8453e4f364fd13af50c9aa22aea63787cb79b1f1cde02c932a06babbc4d8d8f6b7643bf316a45324733db3825d0450d81cdba0ba55f1a9027c12d4b551604eb3fc3ce2136a6c600a675930ad1c287b24add85b6c8850b74fb16eb5540e65a080043c7f611fde8f550ae063a3e4f93edf4f4fa2cde3a91573051ea1d94d29589c4fb7a1a0639e37374e541e3c568c2265400f84f1922889d4caae1261b0ce078ec75864731b3d38df951659f58f8cc3772e7ce831d3641d6b70cff805f015a5321edf4bdc8876e39990efb49fe1a324c2ccef46c4ee923bec59275c866ec0d9a46d84000393cd6067d8d1d4744fdf479865e83dbc12e0e24692935a7bc08f801078ced82da73c73916a06944f2f72e02b681efb7c5660b5c4c055e5778b9014e34b012b56a43a2a7500548d64b127d1910d4937e5e9c158620ad43d383b3e7a1a60ba4009205ee72b5cdad590a102be8f3917bf0ca5fee189051c2df823a6149c3eab4eba44106e3cf799ad2b045d060f2aeac1a12701c0ba4ee61e84e530f20e3f9288b575cd4609b0e1a437880d8cf9074adf525d163d5a2fc31494d4bc06c031363ec404649cc539c8731c5fe8be3d912174f45035d96d25de2b9c58b14d4ef23ce8638141dceb18b89a239df27795fcb4e32815ec71f4b9edc7407a03a697d982c714debbcf4c996fb7b7b751aad37738c05f77694348b916ec0e947b8a8fe9666f8ca929031724d643266d9a2d1f27904a5ec2a3176a1dcd285aaffad9c5e120e0c7f87a024c573cc58c6b53c6f69183803e124cb175e5c4b7581b4225820ab8b60c4b99ff024f0723dcf3db513001838e0e40a73eb32a8323d268e8d07e33595c8482740fb9708e0bacf4180f1e08cc9b5af629284883ad1231ef5e7612e192268ca0613ac5a2780d5bda60209d738c435a9ab3da25197ae09cad6c4390dae56ee7069118c9924116774ff3aaf02f5fe4faabdd7f72305df33a8b8e579fa9f7f2cb51273956abbd4a70bc1287d2f4f727c9e73d892a9daacd1f11a29779a0d5dc18f695d906f7b37c8e360bf8047ba8514179f509fc8d00d8ea2b181dc9028a4025524709d55813cebd3b92c17a52fec028768c841fb2d69e9af09fdf8de61290ce960f852dab78d934db7516f211718faceb8deab6972cd1669827f7121a08d7237245dcea66d473641eedbe88aa1ef680dfbe180185541f006701dc9fe35bed97d9b1b25f9216df89efb38bbf85646c69720c955b903fe6a7bc6bd95bb9c4254a6d1354e7c452e4418a360e0f25921d0e31e14a3d14d6b8414317db8f4ffed0db74baa67ac6419a49e7d700acc2e5578ea113165b7277cbfc5ee21b7c3dfaf01ce8d167b76dcc9fd85be4b0f04a378ea2e6b45ef2bc48a00242c5814f8d8f047d77e48536c2f8d2f38a7da45d98d474db78a725e3b4a0c281d8e9ecab855eaaed2984bc501e1179e8c5a726aaa8fcb3db4d9ccdf3dacee70153cc304e09af938c8a0139808e47fa0827c8b60cf78e46b5629a7022134e62032718ba297eb592619e96811c1051aa89b5588ada195ddb34a94acee5edbe53371bfd3ef082ff4347441522b30349e36860cb881a0a76067211821295c7513a10fbb72fee5c4f62150cf3d5af8f59f4c600dc99f96014b3b67407a055bf88dfcaeba7b3386f2b88b9343b2063a92ec44e01a24ef75a6c27132aac010926b73cfc655db3025fdcdd5650d4e1dc71990aa7c13dec48fb69454d6a3c4c5dd8a5b527d55f597ad4a33a1ccfd9f4786904f2d13f7fca139116798eeb062c5a55c9f64c77e2594197b4f6c3189282a40a248e0da664475fefd03448480e9013bd481afc179a4897088c4000045584946ba00000045786966000049492a000800000006001201030001000000010000001a01050001000000560000001b010500010000005e0000002801030001000000020000001302030001000000010000006987040001000000660000000000000048000000010000004800000001000000060000900700040000003032313001910700040000000102030000a00700040000003031303001a0030001000000ffff000002a00400010000005802000003a00400010000009001000000000000, 'NGE', 'Emergency', 'Installation', 'user', 'Carpentry/Masonry/Steel Works', 'Pending', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `contact_number`, `password`, `username`, `email`, `role`) VALUES
(11, '0912345678', 'password123', 'newuser', 'newuser@example.com', 'Admin'),
(13, '125125', 'asd12345', 'user2', 'user2@gmail.com', 'Staff'),
(15, '09123123', 'asd12345', 'user3', 'user3@gmail.com', 'Personnel'),
(19, '12312323123', 'asd12345', 'user', 'user@gmail.com', 'User'),
(25, '12312333333', 'asd12345', 'Personneltest', 'personneltest@gmail.com', 'Personnel'),
(26, '12333333333', 'asd12345', 'cathy O Tenco', 'cathy@gmail.com', 'User'),
(27, '12312312312', 'asd12345', 'qwerty', 'qwerty123@gmail.com', 'User'),
(28, '12312312231', 'asd12345', 'arnoldjohn.cequina', 'newuser123@example.com', 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
